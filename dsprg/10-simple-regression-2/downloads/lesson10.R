# 第10回：work全体を開き、授業タスクでファイル全体を実行します。
library(readr)
library(dplyr)
options(digits = 17)
records <- read_csv("exercises/lesson10/data/equipment.csv", show_col_types = FALSE)
print(dim(records))
print(colSums(is.na(records)))
train <- filter(records, split == "train")
validation <- filter(records, split == "validation")
print(train$id)
cat("訓練件数", nrow(train), "\n")
cat("訓練範囲", min(train$operating_hours), max(train$operating_hours), "\n")
baseline <- mean(train$energy_kwh)
model <- lm(energy_kwh ~ operating_hours, data = train)
coefficients <- coef(model)
cat("訓練平均 kWh", baseline, "\n")
cat("切片 kWh", coefficients[[1]], "\n")
cat("傾き kWh/h", coefficients[[2]], "\n")

# 固定の訓練結果。
training_result <- train

training_result$baseline_prediction_kwh <- baseline
training_result$regression_prediction_kwh <- predict(model, newdata = training_result)
training_result$baseline_residual_kwh <- training_result$energy_kwh - training_result$baseline_prediction_kwh
training_result$regression_residual_kwh <- training_result$energy_kwh - training_result$regression_prediction_kwh
training_result$baseline_absolute_error_kwh <- abs(training_result$baseline_residual_kwh)
training_result$regression_absolute_error_kwh <- abs(training_result$regression_residual_kwh)
training_metrics <- data.frame(
    model = c("baseline", "regression"),
    n = c(nrow(training_result), nrow(training_result)),
    mae_kwh = c(mean(training_result$baseline_absolute_error_kwh), mean(training_result$regression_absolute_error_kwh)),
    rmse_kwh = c(sqrt(mean(training_result$baseline_residual_kwh ^ 2)), sqrt(mean(training_result$regression_residual_kwh ^ 2)))
)
print(training_metrics)

# 変更演習：右辺をvalidationへ変更します。再学習しません。
evaluation <- train
print(evaluation$id)
cat("評価件数", nrow(evaluation), "\n")

evaluation$baseline_prediction_kwh <- baseline
evaluation$regression_prediction_kwh <- predict(model, newdata = evaluation)
evaluation$baseline_residual_kwh <- evaluation$energy_kwh - evaluation$baseline_prediction_kwh
evaluation$regression_residual_kwh <- evaluation$energy_kwh - evaluation$regression_prediction_kwh
evaluation$baseline_absolute_error_kwh <- abs(evaluation$baseline_residual_kwh)
evaluation$regression_absolute_error_kwh <- abs(evaluation$regression_residual_kwh)
evaluation_metrics <- data.frame(
    model = c("baseline", "regression"),
    n = c(nrow(evaluation), nrow(evaluation)),
    mae_kwh = c(mean(evaluation$baseline_absolute_error_kwh), mean(evaluation$regression_absolute_error_kwh)),
    rmse_kwh = c(sqrt(mean(evaluation$baseline_residual_kwh ^ 2)), sqrt(mean(evaluation$regression_residual_kwh ^ 2)))
)
print(evaluation_metrics)
print(as.data.frame(evaluation))
print(as.data.frame(filter(evaluation, id %in% c("E004", "E005", "E011"))))

# 完成済み描画ひな形：同じ評価行の残差を並べます。
library(ggplot2)
output <- "exercises/lesson10/output"
dir.create(output, recursive = TRUE, showWarnings = FALSE)
columns <- c("id", "split", "operating_hours", "energy_kwh",
             "baseline_prediction_kwh", "regression_prediction_kwh",
             "baseline_residual_kwh", "regression_residual_kwh",
             "baseline_absolute_error_kwh", "regression_absolute_error_kwh")
write_csv(evaluation[, columns], file.path(output, "evaluation.csv"))
plot_rows <- rbind(
    data.frame(operating_hours = evaluation$operating_hours, residual_kwh = evaluation$baseline_residual_kwh, model = "Baseline"),
    data.frame(operating_hours = evaluation$operating_hours, residual_kwh = evaluation$regression_residual_kwh, model = "Regression")
)
limit <- max(abs(plot_rows$residual_kwh)) * 1.1
fig <- ggplot(plot_rows, aes(x = operating_hours, y = residual_kwh)) +
    geom_point(color = "navy") + geom_hline(yintercept = 0, linetype = "dashed") +
    facet_wrap(~ model, nrow = 1) + coord_cartesian(ylim = c(-limit, limit)) +
    labs(x = "Operating time (hours)", y = "Residual (kWh)") + theme_minimal()
ggsave(file.path(output, "residuals.png"), plot = fig, width = 10, height = 4, dpi = 120)
cat("保存先", output, "\n")

# 外挿の実演。実測値がないので誤差は計算しません。
cat("12時間の予測 kWh", predict(model, newdata = data.frame(operating_hours = 12.0)), "\n")
