# 第11回：work全体を開き、授業タスクで実行します。
library(readr)
library(dplyr)
options(digits = 17)
records <- read_csv("exercises/lesson11/data/equipment.csv", show_col_types = FALSE)
print(dim(records))
print(colSums(is.na(records)))
train <- filter(records, split == "train")
validation <- filter(records, split == "validation")
print(train$id)
cat("訓練件数", nrow(train), "\n")
cat("訓練範囲 時間", range(train$operating_hours), "処理量", range(train$throughput_units), "\n")
# 比較用単回帰。このモデルの学習条件は変えません。
simple_model <- lm(energy_kwh ~ operating_hours, data = train)
cat("単回帰 係数（名前に対応）\n")
print(coef(simple_model))
# 必須変更はこの式へ + throughput_units を追加することです。
candidate_formula <- energy_kwh ~ operating_hours + throughput_units
candidate_model <- lm(candidate_formula, data = train)
print(candidate_formula)
cat("候補 係数（名前に対応）\n")
print(coef(candidate_model))

# 固定の訓練結果。
training_result <- train

training_result$simple_prediction_kwh <- predict(simple_model, newdata = training_result)
training_result$candidate_prediction_kwh <- predict(candidate_model, newdata = training_result)
training_result$simple_residual_kwh <- training_result$energy_kwh - training_result$simple_prediction_kwh
training_result$candidate_residual_kwh <- training_result$energy_kwh - training_result$candidate_prediction_kwh
training_result$simple_absolute_error_kwh <- abs(training_result$simple_residual_kwh)
training_result$candidate_absolute_error_kwh <- abs(training_result$candidate_residual_kwh)
training_metrics <- data.frame(
    model = c("simple", "candidate"),
    n = c(nrow(training_result), nrow(training_result)),
    mae_kwh = c(mean(training_result$simple_absolute_error_kwh), mean(training_result$candidate_absolute_error_kwh)),
    rmse_kwh = c(sqrt(mean(training_result$simple_residual_kwh ^ 2)), sqrt(mean(training_result$candidate_residual_kwh ^ 2)))
)
print(as.data.frame(training_result))
print(training_metrics)

# 評価対象は検証20行に固定します。
evaluation <- validation
print(evaluation$id)
cat("評価件数", nrow(evaluation), "\n")

evaluation$simple_prediction_kwh <- predict(simple_model, newdata = evaluation)
evaluation$candidate_prediction_kwh <- predict(candidate_model, newdata = evaluation)
evaluation$simple_residual_kwh <- evaluation$energy_kwh - evaluation$simple_prediction_kwh
evaluation$candidate_residual_kwh <- evaluation$energy_kwh - evaluation$candidate_prediction_kwh
evaluation$simple_absolute_error_kwh <- abs(evaluation$simple_residual_kwh)
evaluation$candidate_absolute_error_kwh <- abs(evaluation$candidate_residual_kwh)
evaluation_metrics <- data.frame(
    model = c("simple", "candidate"),
    n = c(nrow(evaluation), nrow(evaluation)),
    mae_kwh = c(mean(evaluation$simple_absolute_error_kwh), mean(evaluation$candidate_absolute_error_kwh)),
    rmse_kwh = c(sqrt(mean(evaluation$simple_residual_kwh ^ 2)), sqrt(mean(evaluation$candidate_residual_kwh ^ 2)))
)
print(evaluation_metrics)
print(as.data.frame(evaluation))
print(as.data.frame(filter(evaluation, id %in% c("E004", "E005", "E011"))))

# 完成済み描画ひな形：同じ評価行の残差を並べます。
library(ggplot2)
output <- "exercises/lesson11/output"
dir.create(output, recursive = TRUE, showWarnings = FALSE)
columns <- c("id", "split", "operating_hours", "throughput_units", "energy_kwh",
             "simple_prediction_kwh", "candidate_prediction_kwh",
             "simple_residual_kwh", "candidate_residual_kwh",
             "simple_absolute_error_kwh", "candidate_absolute_error_kwh")
write_csv(evaluation[, columns], file.path(output, "evaluation.csv"))
plot_rows <- rbind(
    data.frame(operating_hours = evaluation$operating_hours, residual_kwh = evaluation$simple_residual_kwh, model = "1 Simple"),
    data.frame(operating_hours = evaluation$operating_hours, residual_kwh = evaluation$candidate_residual_kwh, model = "2 Candidate")
)
limit <- max(abs(plot_rows$residual_kwh)) * 1.1
fig <- ggplot(plot_rows, aes(x = operating_hours, y = residual_kwh)) +
    geom_point(color = "navy") + geom_hline(yintercept = 0, linetype = "dashed") +
    facet_wrap(~ model, nrow = 1) + coord_cartesian(ylim = c(-limit, limit)) +
    labs(x = "Operating time (hours)", y = "Residual (kWh)") + theme_minimal()
ggsave(file.path(output, "residuals.png"), plot = fig, width = 10, height = 4, dpi = 120)
cat("保存先", output, "\n")

# 条件付き解釈の実演。実測値・誤差はありません。
queries <- data.frame(operating_hours = c(5.0, 5.0), throughput_units = c(40.0, 80.0))
queries$prediction_kwh <- predict(candidate_model, newdata = queries)
print(queries)
cat("処理量40個増の予測増分 kWh", queries$prediction_kwh[2] - queries$prediction_kwh[1], "\n")
