# A 合計金額
price = 120
quantity = 2
total = price * quantity
print(f"合計は{total}円です")

# B 分から時間へ換算
import numpy as np

study_minutes = np.array([15, 30, 45, 60])
study_hours = study_minutes / 60
print(study_minutes)
print(study_hours)

# C 小さい表・一列・平均
import pandas as pd

records = pd.DataFrame({
    "id": ["A", "B", "C", "D"],
    "study_minutes": study_minutes,
    "quiz_score": [40, 60, 80, 70]
})
print(records)
print(records["study_minutes"])
print(records["study_minutes"].mean())
