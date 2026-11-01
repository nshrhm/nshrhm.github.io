# 第15回 A：work全体を開き、授業タスクで実行します。
from pathlib import Path
from math import sqrt
import pandas as pd
from sklearn.linear_model import LinearRegression
pd.set_option("display.precision", 17)
records = pd.read_csv("exercises/lesson15/data/equipment.csv")
print(records.shape)
print(records.isna().sum())
train = records[records["split"] == "train"].copy()
validation = records[records["split"] == "validation"].copy()
print("訓練ID", train["id"].tolist())
print("訓練件数", len(train))
print("訓練範囲", train[["operating_hours", "throughput_units"]].agg(["min", "max"]))
# 比較用単回帰。このモデルの学習条件は変えません。
simple_model = LinearRegression()
simple_model.fit(train[["operating_hours"]], train["energy_kwh"])
print("単回帰 切片 kWh", simple_model.intercept_)
print("単回帰 列名", ["operating_hours"])
print("単回帰 係数（列名順）", simple_model.coef_.tolist())
# 必須変更はこのリストに処理量を追加することです。
candidate_features = ["operating_hours"]
candidate_model = LinearRegression()
candidate_model.fit(train[candidate_features], train["energy_kwh"])
print("候補 切片 kWh", candidate_model.intercept_)
print("候補 列名", candidate_features)
print("候補 係数（列名順）", candidate_model.coef_.tolist())

# 固定の訓練結果。学習に使った同じ60行です。
training_result = train.copy()

training_result["simple_prediction_kwh"] = simple_model.predict(training_result[["operating_hours"]])
training_result["candidate_prediction_kwh"] = candidate_model.predict(training_result[candidate_features])
training_result["simple_residual_kwh"] = training_result["energy_kwh"] - training_result["simple_prediction_kwh"]
training_result["candidate_residual_kwh"] = training_result["energy_kwh"] - training_result["candidate_prediction_kwh"]
training_result["simple_absolute_error_kwh"] = training_result["simple_residual_kwh"].abs()
training_result["candidate_absolute_error_kwh"] = training_result["candidate_residual_kwh"].abs()
training_metrics = pd.DataFrame({
    "model": ["simple", "candidate"],
    "n": [len(training_result), len(training_result)],
    "mae_kwh": [training_result["simple_absolute_error_kwh"].mean(), training_result["candidate_absolute_error_kwh"].mean()],
    "rmse_kwh": [sqrt((training_result["simple_residual_kwh"] ** 2).mean()), sqrt((training_result["candidate_residual_kwh"] ** 2).mean())],
})
print(training_result.to_string(index=False))
print(training_metrics.to_string(index=False))

# 評価対象は検証20行に固定します。
evaluation = validation.copy()
print("評価ID", evaluation["id"].tolist())
print("評価件数", len(evaluation))

evaluation["simple_prediction_kwh"] = simple_model.predict(evaluation[["operating_hours"]])
evaluation["candidate_prediction_kwh"] = candidate_model.predict(evaluation[candidate_features])
evaluation["simple_residual_kwh"] = evaluation["energy_kwh"] - evaluation["simple_prediction_kwh"]
evaluation["candidate_residual_kwh"] = evaluation["energy_kwh"] - evaluation["candidate_prediction_kwh"]
evaluation["simple_absolute_error_kwh"] = evaluation["simple_residual_kwh"].abs()
evaluation["candidate_absolute_error_kwh"] = evaluation["candidate_residual_kwh"].abs()
evaluation_metrics = pd.DataFrame({
    "model": ["simple", "candidate"],
    "n": [len(evaluation), len(evaluation)],
    "mae_kwh": [evaluation["simple_absolute_error_kwh"].mean(), evaluation["candidate_absolute_error_kwh"].mean()],
    "rmse_kwh": [sqrt((evaluation["simple_residual_kwh"] ** 2).mean()), sqrt((evaluation["candidate_residual_kwh"] ** 2).mean())],
})
print(evaluation_metrics.to_string(index=False))
print(evaluation.to_string(index=False))
# 指定した検証3行を確認します。
print(evaluation[evaluation["id"].isin(["E004", "E005", "E011"])].to_string(index=False))

# 完成済み描画ひな形：同じ評価行の残差を並べます。
import matplotlib.pyplot as plt
output = Path("exercises/lesson15/output/A")
output.mkdir(parents=True, exist_ok=True)
columns = ["id", "split", "operating_hours", "throughput_units", "energy_kwh",
           "simple_prediction_kwh", "candidate_prediction_kwh",
           "simple_residual_kwh", "candidate_residual_kwh",
           "simple_absolute_error_kwh", "candidate_absolute_error_kwh"]
evaluation[columns].to_csv(output / "analysis.csv", index=False)
limit = max(evaluation["simple_absolute_error_kwh"].max(), evaluation["candidate_absolute_error_kwh"].max()) * 1.1
fig, axes = plt.subplots(1, 2, figsize=(10, 4), sharey=True)
axes[0].scatter(evaluation["operating_hours"], evaluation["simple_residual_kwh"], color="gray")
axes[1].scatter(evaluation["operating_hours"], evaluation["candidate_residual_kwh"], color="navy")
# このループは描画設定用です。変更する必要はありません。
for ax, title in zip(axes, ["Simple", "Candidate"]):
    ax.axhline(0, color="black", linestyle="--")
    ax.set_xlabel("Operating time (hours)")
    ax.set_ylabel("Residual (kWh)")
    ax.set_ylim(-limit, limit)
    ax.set_title(title)
fig.tight_layout()
fig.savefig(output / "figure.png", dpi=120)
plt.close(fig)
print("保存先", output)

# 保存した表を読み直し、IDで対応させて比較します。
reloaded = pd.read_csv(output / "analysis.csv", float_precision="round_trip")
print("保存後の一致:", evaluation[columns].reset_index(drop=True).equals(reloaded[columns]))
