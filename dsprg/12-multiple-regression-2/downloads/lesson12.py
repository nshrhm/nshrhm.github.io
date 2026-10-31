# 第12回：work全体を開き、授業タスクで実行します。
from pathlib import Path
from math import sqrt
import pandas as pd
from sklearn.linear_model import LinearRegression
pd.set_option("display.precision", 17)
records = pd.read_csv("exercises/lesson12/data/equipment.csv")
print(records.shape)
print(records.isna().sum())
train = records[records["split"] == "train"].copy()
validation = records[records["split"] == "validation"].copy()
print("訓練ID", train["id"].tolist())
print("訓練件数", len(train))
print("検証ID", validation["id"].tolist())
print("検証件数", len(validation))
# 事前に決めた3候補。列・学習行・目的変数は変更しません。
features = {
    "hours": ["operating_hours"],
    "throughput": ["throughput_units"],
    "both": ["operating_hours", "throughput_units"],
}
models = {}
comparison_rows = []
# このループは全候補を同じ条件で計算する完成済みの処理です。
for key, columns in features.items():
    model = LinearRegression()
    model.fit(train[columns], train["energy_kwh"])
    models[key] = model
    print("候補", key, "列名", columns)
    print("切片 kWh", model.intercept_)
    print("係数（列名順）", model.coef_.tolist())
    for split, subset in [("train", train), ("validation", validation)]:
        prediction = model.predict(subset[columns])
        residual = subset["energy_kwh"] - prediction
        absolute_error = residual.abs()
        comparison_rows.append({
            "model": key, "split": split, "n": len(subset),
            "n_features": len(columns), "mae_kwh": absolute_error.mean(),
            "rmse_kwh": sqrt((residual ** 2).mean()),
        })
comparison = pd.DataFrame(comparison_rows)
print(comparison.to_string(index=False))
# 必須変更：検証RMSEの比較表を読み、この選択指定を変更します。
selected_key = "both"
selected_model = models[selected_key]
selected_columns = features[selected_key]
print("選択候補", selected_key, "列名", selected_columns)
# 学習済みモデルを取り出すだけです。ここで再学習しません。
evaluation = validation[["id", "split", "operating_hours", "throughput_units", "energy_kwh"]].copy()
evaluation["model"] = selected_key
evaluation["prediction_kwh"] = selected_model.predict(evaluation[selected_columns])
evaluation["residual_kwh"] = evaluation["energy_kwh"] - evaluation["prediction_kwh"]
evaluation["absolute_error_kwh"] = evaluation["residual_kwh"].abs()
print(evaluation.to_string(index=False))
print(evaluation[evaluation["id"].isin(["E004", "E005", "E011"])].to_string(index=False))

# 完成済み保存・描画ひな形。照合言語には保存を要求しません。
import matplotlib.pyplot as plt
output = Path("exercises/lesson12/output")
output.mkdir(parents=True, exist_ok=True)
comparison.to_csv(output / "comparison.csv", index=False)
evaluation.to_csv(output / "evaluation.csv", index=False)
keys = ["hours", "throughput", "both"]
positions = [0, 1, 2]
fig, ax = plt.subplots(figsize=(8, 4))
for split, offset in [("train", -0.2), ("validation", 0.2)]:
    heights = [comparison[(comparison["model"] == key) & (comparison["split"] == split)]["rmse_kwh"].iloc[0] for key in keys]
    ax.bar([x + offset for x in positions], heights, width=0.4, label=split)
ax.set_xticks(positions, keys)
ax.set_xlabel("Candidate model")
ax.set_ylabel("RMSE (kWh)")
ax.set_ylim(bottom=0)
ax.legend(title="Split")
fig.tight_layout()
fig.savefig(output / "comparison.png", dpi=120)
plt.close(fig)
print("保存先", output)
