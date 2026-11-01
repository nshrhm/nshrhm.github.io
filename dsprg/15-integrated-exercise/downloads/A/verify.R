# 第15回 A：照合言語も元CSVから独立に計算します。
library(readr)
options(digits = 17)
records <- read_csv("exercises/lesson15/data/equipment.csv", show_col_types = FALSE)
train <- records[records$split == "train", ]
validation <- records[records$split == "validation", ]
print(train$id)
print(nrow(train))
print(validation$id)
print(nrow(validation))
# 必須変更：処理量を追加します。
candidate_formula <- energy_kwh ~ operating_hours
candidate_model <- lm(candidate_formula, data = train)
print(candidate_formula)
print(coef(candidate_model))
evaluation <- as.data.frame(validation)
evaluation$candidate_prediction_kwh <- predict(candidate_model, newdata = evaluation)
evaluation$candidate_residual_kwh <- evaluation$energy_kwh - evaluation$candidate_prediction_kwh
evaluation$candidate_absolute_error_kwh <- abs(evaluation$candidate_residual_kwh)
evaluation_metrics <- data.frame(model = "candidate", n = nrow(evaluation),
    mae_kwh = mean(evaluation$candidate_absolute_error_kwh),
    rmse_kwh = sqrt(mean(evaluation$candidate_residual_kwh ^ 2)))
print(evaluation)
print(evaluation_metrics)
print(evaluation[evaluation$id %in% c("E004", "E005", "E011"), ])
