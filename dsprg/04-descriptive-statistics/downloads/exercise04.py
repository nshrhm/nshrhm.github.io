# 第4回 演習：AはLの120を90へ。Bは得点平均の表示を追加。
# 架空の12件の学習記録
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

# A 表を作り、一列を要約する
records = pd.DataFrame({
    "id": list("ABCDEFGHIJKL"),
    "study_minutes": [15, 30, 45, 60, 30, 45, 60, 75, 45, 60, 75, 120],
    "quiz_score": [40, 60, 80, 70, 55, 65, 75, 85, 60, 70, 80, 90],
})
print(records)
print("件数:", len(records))
print("学習時間の平均:", records["study_minutes"].mean())
print("中央値:", records["study_minutes"].median())
print("標本標準偏差:", records["study_minutes"].std(ddof=1))

# B 同じ区間で分布を見る。保存先はworkからの相対パス
output = Path("exercises/lesson04/output")
output.mkdir(parents=True, exist_ok=True)
plt.rcParams["font.family"] = "Noto Sans CJK JP"
plt.rcParams["font.size"] = 16
breaks = [0, 30, 60, 90, 120, 150]
fig, ax = plt.subplots(figsize=(8, 5))
ax.hist(records["study_minutes"], bins=breaks, edgecolor="white")
ax.set(xlabel="学習時間（分）", ylabel="件数", title="学習時間の分布",
       xlim=(0, 150), ylim=(0, 6), xticks=breaks, yticks=range(7))
fig.tight_layout()
fig.savefig(output / "exercise04_python_hist.png", dpi=150)
plt.close(fig)

# C 横軸は学習時間、縦軸は小テスト得点
fig, ax = plt.subplots(figsize=(8, 5))
ax.scatter(records["study_minutes"], records["quiz_score"])
ax.set(xlabel="学習時間（分）", ylabel="小テスト得点（点）",
       title="学習時間と小テスト得点", xlim=(0, 150), ylim=(0, 100))
fig.tight_layout()
fig.savefig(output / "exercise04_python_scatter.png", dpi=150)
plt.close(fig)
print("保存先:", output.resolve())
