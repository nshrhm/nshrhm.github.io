# 第15回 B: 標準化した4測定値でクラスタ数を比較する。
options(digits = 16)
# 必須変更: 主言語・照合言語の両方で 2 を 3 にする。
k_candidate <- 3
features <- c("sepal_length_cm", "sepal_width_cm", "petal_length_cm", "petal_width_cm")
data <- read.csv("exercises/lesson15/data/iris.csv")
print(head(data))
print(data$id)
print(nrow(data))
print(features)
X <- data[, features]
means <- colMeans(X)
sample_sd <- sapply(X, sd)
Z <- scale(X, center = means, scale = sample_sd)
print(means)
print(sample_sd)
initial_ids <- list("2" = c("I001", "I101"), "3" = c("I001", "I051", "I101"))
results <- list()
summaries <- list()
for (analysis in c("baseline", "candidate")) {
  k <- if (analysis == "baseline") 2 else k_candidate
  chosen <- initial_ids[[as.character(k)]]
  initial <- Z[match(chosen, data$id), , drop = FALSE]
  model <- kmeans(Z, centers = initial, nstart = 1, algorithm = "Lloyd", iter.max = 300)
  labels <- model$cluster
  centers <- data.frame(cluster = seq_len(k), model$centers, row.names = NULL)
  distance_sq <- rowSums((Z - model$centers[labels, , drop = FALSE])^2)
  assignments <- data.frame(id = data$id, cluster = labels, distance_sq = distance_sq)
  summary <- aggregate(X, by = list(cluster = labels), FUN = mean)
  names(summary)[-1] <- paste0("mean_", features)
  summary <- data.frame(analysis = analysis, k = k, cluster = summary$cluster,
                        n = as.integer(table(factor(labels, levels = summary$cluster))), summary[, -1])
  print(analysis)
  print(k)
  print(chosen)
  print(centers)
  print(summary)
  print(assignments)
  print(model$tot.withinss)
  print(sum(distance_sq))
  print(assignments[assignments$id %in% c("I001", "I051", "I101"), ])
  results[[analysis]] <- list(model = model, assignments = assignments, summary = summary, k = k)
  summaries[[analysis]] <- summary
}
comparison <- do.call(rbind, summaries)
selected <- results[["candidate"]]
print(Z[1, ])
print(rowSums(sweep(selected$model$centers, 2, Z[1, ], FUN = "-")^2))
# 描画用PCAは一度だけ計算する。群分けには4列のZを使う。
pca <- prcomp(Z, center = TRUE, scale. = FALSE)
coordinates <- pca$x[, 1:2]
ratios <- (pca$sdev^2 / sum(pca$sdev^2))[1:2]
# SAVE_BEGIN
output <- "exercises/lesson15/output/B"
dir.create(output, recursive = TRUE, showWarnings = FALSE)
analysis_table <- data[, c("id", features)]
for (key in c("baseline", "candidate")) {
  analysis_table[[paste0(key, "_cluster")]] <- results[[key]]$assignments$cluster
  analysis_table[[paste0(key, "_distance_sq")]] <- results[[key]]$assignments$distance_sq
}
write.csv(analysis_table, file.path(output, "analysis.csv"), row.names = FALSE)
reloaded <- read.csv(file.path(output, "analysis.csv"))
print(all.equal(analysis_table, reloaded, check.attributes = FALSE, tolerance = 1e-8))
png(file.path(output, "figure.png"), width = 1200, height = 576, res = 120)
par(mfrow = c(1, 2))
palette <- c("#2563eb", "#ea580c", "#15803d")
for (analysis in c("baseline", "candidate")) {
  result <- results[[analysis]]
  plot(coordinates[, 1], coordinates[, 2], col = palette[result$model$cluster], pch = 16, cex = 0.7,
       xlim = range(coordinates[, 1]), ylim = range(coordinates[, 2]), asp = 1,
       xlab = sprintf("PC1 (unitless), %.1f%%", 100 * ratios[1]),
       ylab = sprintf("PC2 (unitless), %.1f%%", 100 * ratios[2]),
       main = sprintf("%s: k=%d, clustering in 4D", analysis, result$k))
  legend("topright", legend = paste("cluster", seq_len(result$k)), col = palette[seq_len(result$k)], pch = 16)
}
dev.off()
print(output)
# SAVE_END
