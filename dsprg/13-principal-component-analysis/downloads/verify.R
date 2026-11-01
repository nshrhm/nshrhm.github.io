# 第13回: 標準化の有無でPCAを比較する。既存のRタスクで実行。
# 必須変更: 主言語・照合言語の両方で TRUE にする。
standardize <- FALSE
features <- c("sepal_length_cm", "sepal_width_cm", "petal_length_cm", "petal_width_cm")
data <- read.csv("exercises/lesson13/data/iris.csv", stringsAsFactors = FALSE)
print(head(data))
print("使用ID:")
print(data$id)
print("件数:")
print(nrow(data))
print("使用列:")
print(features)
X <- data[features]
means <- colMeans(X)
sample_sd <- sapply(X, sd)
print("列平均 (cm):")
print(means)
print("標本標準偏差 (cm, 分母n-1):")
print(sample_sd)

results <- list()
variance_tables <- list()
for (analysis in c("baseline", "candidate")) {
  scaled <- if (analysis == "baseline") FALSE else standardize
  model <- prcomp(X, center = TRUE, scale. = scaled)
  # prcompは4成分を計算。寄与率の分母は全4成分の分散合計。
  weights <- model$rotation[, 1:2, drop = FALSE]
  scores <- data.frame(id = data$id, PC1 = model$x[, 1], PC2 = model$x[, 2])
  all_ratios <- model$sdev^2 / sum(model$sdev^2)
  ratios <- all_ratios[1:2]
  variance <- data.frame(
    analysis = analysis, standardized = scaled, component = c("PC1", "PC2"),
    explained_variance_ratio = ratios, cumulative_ratio = cumsum(ratios)
  )
  print(analysis)
  print(scaled)
  print("係数: 行=元の列、列=主成分")
  print(weights)
  print(variance)
  print(scores)
  print("指定行:")
  print(scores[scores$id %in% c("I001", "I051", "I101"), ])
  results[[analysis]] <- list(model = model, weights = weights, scores = scores, scaled = scaled, ratios = ratios)
  variance_tables[[analysis]] <- variance
}

comparison <- do.call(rbind, variance_tables)
selected <- results[["candidate"]]
print("I001の標準化値 (無次元):")
print((unlist(X[1, ]) - means) / sample_sd)
print("手計算用: 上の4つの標準化値にcandidateのPC1係数を掛けて合計する。")
# 照合用では保存を要求しない。
