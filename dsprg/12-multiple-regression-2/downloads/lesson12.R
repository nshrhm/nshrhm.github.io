# 第12回：work全体を開き、授業タスクで実行します。
library(readr)
library(dplyr)
options(digits = 17)
records <- read_csv("exercises/lesson12/data/equipment.csv", show_col_types = FALSE)
print(dim(records))
print(colSums(is.na(records)))
train <- filter(records, split == "train")
validation <- filter(records, split == "validation")
print(train$id)
cat("訓練件数", nrow(train), "\n")
print(validation$id)
cat("検証件数", nrow(validation), "\n")
# 事前に決めた3候補。式・学習行・目的変数は変更しません。
formulas <- list(
    hours = energy_kwh ~ operating_hours,
    throughput = energy_kwh ~ throughput_units,
    both = energy_kwh ~ operating_hours + throughput_units
)
models <- list()
comparison_rows <- list()
# 完成済みの処理。名前付きリストから式を取り出して学習します。
for (key in names(formulas)) {
    model <- lm(formulas[[key]], data = train)
    models[[key]] <- model
    cat("候補", key, "\n")
    print(formulas[[key]])
    print(coef(model))
    for (split_name in c("train", "validation")) {
        subset <- if (split_name == "train") train else validation
        prediction <- predict(model, newdata = subset)
        residual <- subset$energy_kwh - prediction
        absolute_error <- abs(residual)
        comparison_rows[[length(comparison_rows) + 1]] <- data.frame(
            model = key, split = split_name, n = nrow(subset),
            n_features = length(coef(model)) - 1,
            mae_kwh = mean(absolute_error), rmse_kwh = sqrt(mean(residual ^ 2))
        )
    }
}
comparison <- do.call(rbind, comparison_rows)
print(comparison)
# 必須変更：検証RMSEの比較表を読み、この選択指定を変更します。
selected_key <- "both"
selected_model <- models[[selected_key]]
cat("選択候補", selected_key, "\n")
# 選択後の再学習は行いません。
evaluation <- validation[, c("id", "split", "operating_hours", "throughput_units", "energy_kwh")]
evaluation$model <- selected_key
evaluation$prediction_kwh <- predict(selected_model, newdata = evaluation)
evaluation$residual_kwh <- evaluation$energy_kwh - evaluation$prediction_kwh
evaluation$absolute_error_kwh <- abs(evaluation$residual_kwh)
print(as.data.frame(evaluation))
print(as.data.frame(filter(evaluation, id %in% c("E004", "E005", "E011"))))

# 完成済み保存・描画ひな形。
library(ggplot2)
output <- "exercises/lesson12/output"
dir.create(output, recursive = TRUE, showWarnings = FALSE)
write_csv(comparison, file.path(output, "comparison.csv"))
write_csv(evaluation, file.path(output, "evaluation.csv"))
fig <- ggplot(comparison, aes(x = model, y = rmse_kwh, fill = split)) +
    geom_col(position = "dodge") +
    scale_y_continuous(limits = c(0, NA), expand = expansion(mult = c(0, 0.05))) +
    labs(x = "Candidate model", y = "RMSE (kWh)", fill = "Split") + theme_minimal()
ggsave(file.path(output, "comparison.png"), plot = fig, width = 8, height = 4, dpi = 120)
cat("保存先", output, "\n")
