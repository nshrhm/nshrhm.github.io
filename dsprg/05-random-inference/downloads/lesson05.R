# 仮想母集団。実在の学生の記録ではありません。
seed <- 2026
n <- 12
mu <- 50
sigma <- 10
set.seed(seed)
sample <- rnorm(n, mean = mu, sd = sigma)
average <- mean(sample)
s <- sd(sample)  # 分母 n−1
critical <- qt(0.975, df = n - 1)
margin <- critical * s / sqrt(n)
lower <- average - margin
upper <- average + margin
cat("標本:", sample, "\n")
cat("平均:", average, "\n")
cat("標本標準偏差:", s, "\n")
cat("95%信頼区間の下限:", lower, "\n")
cat("95%信頼区間の上限:", upper, "\n")
