# 第9回：work全体を開き、授業タスクでファイル全体を実行します。
library(readr)
library(dplyr)
options(digits = 17)
records <- read_csv("exercises/lesson09/data/equipment.csv", show_col_types = FALSE)
print(dim(records))
print(colSums(is.na(records)))
train <- filter(records, split == "train")
print(train$id)
cat("訓練件数", nrow(train), "\n")
cat("稼働時間範囲", min(train$operating_hours), max(train$operating_hours), "\n")
model <- lm(energy_kwh ~ operating_hours, data = train)
coefficients <- coef(model)
cat("切片 kWh", coefficients[[1]], "\n")
cat("傾き kWh/h", coefficients[[2]], "\n")
# 変更演習：予測入力だけを3・5・7時間へ変更します。
queries <- data.frame(operating_hours = c(2.0, 4.0, 6.0))
queries$prediction_kwh <- predict(model, newdata = queries)
print(queries)

library(ggplot2)
output <- "exercises/lesson09/output"
dir.create(output, recursive = TRUE, showWarnings = FALSE)
write_csv(queries, file.path(output, "predictions.csv"))
# 描画ひな形：学習済みmodelをそのまま使います。
line <- arrange(train, operating_hours)
line$prediction_kwh <- predict(model, newdata = line)
fig <- ggplot(train, aes(x = operating_hours, y = energy_kwh)) +
  geom_point(alpha = 0.6) +
  geom_line(data = line, aes(y = prediction_kwh), color = "navy") +
  geom_point(data = queries, aes(y = prediction_kwh), color = "red", shape = 4, size = 3) +
  labs(x = "Operating time (hours)", y = "Energy (kWh)",
       subtitle = "Training records: dots; fitted line: navy; predictions: red crosses") +
  theme_minimal()
ggsave(file.path(output, "regression.png"), plot = fig, width = 8, height = 5, dpi = 120)
cat("保存先", output, "\n")
