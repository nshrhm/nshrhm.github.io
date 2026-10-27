# A 合計金額
price <- 120
quantity <- 2
total <- price * quantity
cat("合計は", total, "円です\n", sep = "")

# B 分から時間へ換算
study_minutes <- c(15, 30, 45, 60)
study_hours <- study_minutes / 60
print(study_minutes)
print(study_hours)

# C 小さい表・一列・平均
records <- data.frame(
  id = c("A", "B", "C", "D"),
  study_minutes = study_minutes,
  quiz_score = c(40, 60, 80, 70)
)
print(records)
print(records$study_minutes)
print(mean(records$study_minutes))
