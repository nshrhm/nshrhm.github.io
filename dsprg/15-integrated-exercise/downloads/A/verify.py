"""第15回 A：照合言語も元CSVから独立に計算します。"""
from math import sqrt
import pandas as pd
from sklearn.linear_model import LinearRegression
pd.set_option("display.precision", 17)
records = pd.read_csv("exercises/lesson15/data/equipment.csv")
train = records[records["split"] == "train"].copy()
validation = records[records["split"] == "validation"].copy()
print("訓練ID", train["id"].tolist())
print("訓練件数", len(train))
print("検証ID", validation["id"].tolist())
print("検証件数", len(validation))
# 必須変更：処理量を追加します。
candidate_features = ["operating_hours"]
candidate_model = LinearRegression()
candidate_model.fit(train[candidate_features], train["energy_kwh"])
print("使用列", candidate_features)
print("切片 kWh", candidate_model.intercept_)
print("係数（列名順）", candidate_model.coef_.tolist())
evaluation = validation.copy()
evaluation["candidate_prediction_kwh"] = candidate_model.predict(evaluation[candidate_features])
evaluation["candidate_residual_kwh"] = evaluation["energy_kwh"] - evaluation["candidate_prediction_kwh"]
evaluation["candidate_absolute_error_kwh"] = evaluation["candidate_residual_kwh"].abs()
evaluation_metrics = pd.DataFrame({"model": ["candidate"], "n": [len(evaluation)],
    "mae_kwh": [evaluation["candidate_absolute_error_kwh"].mean()],
    "rmse_kwh": [sqrt((evaluation["candidate_residual_kwh"] ** 2).mean())]})
print(evaluation.to_string(index=False))
print(evaluation_metrics.to_string(index=False))
print(evaluation[evaluation["id"].isin(["E004", "E005", "E011"])].to_string(index=False))
