# 仮想母集団。実在の学生の記録ではありません。
import numpy as np

seed = 2026
n = 12
mu = 50
sigma = 10
rng = np.random.default_rng(seed)
sample = rng.normal(mu, sigma, n)
average = np.mean(sample)
s = np.std(sample, ddof=1)  # 分母 n−1
from scipy.stats import t
critical = t.ppf(0.975, df=n - 1)
margin = critical * s / np.sqrt(n)
lower = average - margin
upper = average + margin
print("標本:", sample)
print("平均:", average)
print("標本標準偏差:", s)
print("95%信頼区間の下限:", lower)
print("95%信頼区間の上限:", upper)
