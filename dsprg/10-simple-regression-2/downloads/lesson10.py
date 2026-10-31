# 第10回：work全体を開き、授業タスクでファイル全体を実行します。
from pathlib import Path
from math import sqrt
import pandas as pd
pd.set_option("display.precision", 17)
from sklearn.linear_model import LinearRegression

records = pd.read_csv("exercises/lesson10/data/equipment.csv")
print(records.shape)
print(records.isna().sum())
train = records[records["split"] == "train"].copy()
validation = records[records["split"] == "validation"].copy()
print("訓練ID", train["id"].tolist())
print("訓練件数", len(train))
print("訓練範囲", train["operating_hours"].min(), train["operating_hours"].max())
baseline = train["energy_kwh"].mean()
model = LinearRegression()
model.fit(train[["operating_hours"]], train["energy_kwh"])
print("訓練平均 kWh", baseline)
print("切片 kWh", model.intercept_)
print("傾き kWh/h", model.coef_[0])

# 固定の訓練結果。学習に使った同じ60行です。
training_result = train.copy()

training_result["baseline_prediction_kwh"] = baseline
training_result["regression_prediction_kwh"] = model.predict(training_result[["operating_hours"]])
training_result["baseline_residual_kwh"] = training_result["energy_kwh"] - training_result["baseline_prediction_kwh"]
training_result["regression_residual_kwh"] = training_result["energy_kwh"] - training_result["regression_prediction_kwh"]
training_result["baseline_absolute_error_kwh"] = training_result["baseline_residual_kwh"].abs()
training_result["regression_absolute_error_kwh"] = training_result["regression_residual_kwh"].abs()
training_metrics = pd.DataFrame({
    "model": ["baseline", "regression"],
    "n": [len(training_result), len(training_result)],
    "mae_kwh": [training_result["baseline_absolute_error_kwh"].mean(), training_result["regression_absolute_error_kwh"].mean()],
    "rmse_kwh": [sqrt((training_result["baseline_residual_kwh"] ** 2).mean()), sqrt((training_result["regression_residual_kwh"] ** 2).mean())],
})
print(training_metrics.to_string(index=False))

# 変更演習：この行だけvalidation.copy()へ変更します。再学習しません。
evaluation = train.copy()
print("評価ID", evaluation["id"].tolist())
print("評価件数", len(evaluation))

evaluation["baseline_prediction_kwh"] = baseline
evaluation["regression_prediction_kwh"] = model.predict(evaluation[["operating_hours"]])
evaluation["baseline_residual_kwh"] = evaluation["energy_kwh"] - evaluation["baseline_prediction_kwh"]
evaluation["regression_residual_kwh"] = evaluation["energy_kwh"] - evaluation["regression_prediction_kwh"]
evaluation["baseline_absolute_error_kwh"] = evaluation["baseline_residual_kwh"].abs()
evaluation["regression_absolute_error_kwh"] = evaluation["regression_residual_kwh"].abs()
evaluation_metrics = pd.DataFrame({
    "model": ["baseline", "regression"],
    "n": [len(evaluation), len(evaluation)],
    "mae_kwh": [evaluation["baseline_absolute_error_kwh"].mean(), evaluation["regression_absolute_error_kwh"].mean()],
    "rmse_kwh": [sqrt((evaluation["baseline_residual_kwh"] ** 2).mean()), sqrt((evaluation["regression_residual_kwh"] ** 2).mean())],
})
print(evaluation_metrics.to_string(index=False))
print(evaluation.to_string(index=False))
# 指定行は検証へ変更すると3行表示されます。未変更なら0行です。
print(evaluation[evaluation["id"].isin(["E004", "E005", "E011"])].to_string(index=False))

# 完成済み描画ひな形：同じ評価行の残差を並べます。
import matplotlib.pyplot as plt
output = Path("exercises/lesson10/output")
output.mkdir(parents=True, exist_ok=True)
columns = ["id", "split", "operating_hours", "energy_kwh",
           "baseline_prediction_kwh", "regression_prediction_kwh",
           "baseline_residual_kwh", "regression_residual_kwh",
           "baseline_absolute_error_kwh", "regression_absolute_error_kwh"]
evaluation[columns].to_csv(output / "evaluation.csv", index=False)
limit = max(evaluation["baseline_absolute_error_kwh"].max(), evaluation["regression_absolute_error_kwh"].max()) * 1.1
fig, axes = plt.subplots(1, 2, figsize=(10, 4), sharey=True)
axes[0].scatter(evaluation["operating_hours"], evaluation["baseline_residual_kwh"], color="gray")
axes[1].scatter(evaluation["operating_hours"], evaluation["regression_residual_kwh"], color="navy")
# このループは描画設定用です。変更する必要はありません。
for ax, title in zip(axes, ["Baseline", "Regression"]):
    ax.axhline(0, color="black", linestyle="--")
    ax.set_xlabel("Operating time (hours)")
    ax.set_ylabel("Residual (kWh)")
    ax.set_ylim(-limit, limit)
    ax.set_title(title)
fig.tight_layout()
fig.savefig(output / "residuals.png", dpi=120)
plt.close(fig)
print("保存先", output)

# 外挿の実演。実測値がないので誤差は計算しません。
print("12時間の予測 kWh", model.predict(pd.DataFrame({"operating_hours": [12.0]}))[0])
