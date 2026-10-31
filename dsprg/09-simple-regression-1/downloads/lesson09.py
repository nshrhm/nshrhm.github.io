# 第9回：work全体を開き、授業タスクでファイル全体を実行します。
from pathlib import Path
import pandas as pd
from sklearn.linear_model import LinearRegression

records = pd.read_csv("exercises/lesson09/data/equipment.csv")
print(records.shape)
print(records.isna().sum())
train = records[records["split"] == "train"].copy()
print("訓練ID", train["id"].tolist())
print("訓練件数", len(train))
print("稼働時間範囲", train["operating_hours"].min(), train["operating_hours"].max())
x = train[["operating_hours"]]
y = train["energy_kwh"]
model = LinearRegression()
model.fit(x, y)
print("切片 kWh", model.intercept_)
print("傾き kWh/h", model.coef_[0])
# 変更演習：予測入力だけを3・5・7時間へ変更します。
queries = pd.DataFrame({"operating_hours": [2.0, 4.0, 6.0]})
queries["prediction_kwh"] = model.predict(queries[["operating_hours"]])
print(queries.to_string(index=False))

import matplotlib.pyplot as plt
output = Path("exercises/lesson09/output")
output.mkdir(parents=True, exist_ok=True)
queries.to_csv(output / "predictions.csv", index=False)
# 描画ひな形：学習済みmodelをそのまま使います。
line = train[["operating_hours"]].sort_values("operating_hours")
line_prediction = model.predict(line)
fig, ax = plt.subplots(figsize=(8, 5))
ax.scatter(train["operating_hours"], train["energy_kwh"], label="Training records", alpha=0.6)
ax.plot(line["operating_hours"], line_prediction, label="Fitted line", color="navy")
ax.scatter(queries["operating_hours"], queries["prediction_kwh"], label="Predictions", marker="x", color="red", s=80)
ax.set_xlabel("Operating time (hours)")
ax.set_ylabel("Energy (kWh)")
ax.legend()
fig.tight_layout()
fig.savefig(output / "regression.png", dpi=120)
plt.close(fig)
print("保存先", output)
