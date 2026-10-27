# 第4回 主例：架空の12件の学習記録
library(ggplot2)

# A 表を作り、一列を要約する
records <- data.frame(
  id = LETTERS[1:12],
  study_minutes = c(15, 30, 45, 60, 30, 45, 60, 75, 45, 60, 75, 120),
  quiz_score = c(40, 60, 80, 70, 55, 65, 75, 85, 60, 70, 80, 90)
)
print(records)
cat("件数:", nrow(records), "\n")
cat("学習時間の平均:", mean(records$study_minutes), "\n")
cat("中央値:", median(records$study_minutes), "\n")
cat("標本標準偏差:", sd(records$study_minutes), "\n")

# B 同じ区間で分布を見る。保存先はworkからの相対パス
output <- "exercises/lesson04/output"
dir.create(output, recursive = TRUE, showWarnings = FALSE)
breaks <- c(0, 30, 60, 90, 120, 150)
histogram <- ggplot(records, aes(x = study_minutes)) +
  geom_histogram(breaks = breaks, closed = "left", colour = "white") +
  scale_x_continuous(breaks = breaks, limits = c(0, 150)) +
  scale_y_continuous(breaks = 0:6, limits = c(0, 6)) +
  labs(x = "学習時間（分）", y = "件数", title = "学習時間の分布") +
  theme_minimal(base_size = 16, base_family = "Noto Sans CJK JP")
ggsave(file.path(output, "lesson04_r_hist.png"), plot = histogram,
       width = 8, height = 5, dpi = 150)

# C 横軸は学習時間、縦軸は小テスト得点
scatter <- ggplot(records, aes(x = study_minutes, y = quiz_score)) +
  geom_point(size = 3) +
  coord_cartesian(xlim = c(0, 150), ylim = c(0, 100)) +
  labs(x = "学習時間（分）", y = "小テスト得点（点）",
       title = "学習時間と小テスト得点") +
  theme_minimal(base_size = 16, base_family = "Noto Sans CJK JP")
ggsave(file.path(output, "lesson04_r_scatter.png"), plot = scatter,
       width = 8, height = 5, dpi = 150)
cat("保存先:", normalizePath(output), "\n")
