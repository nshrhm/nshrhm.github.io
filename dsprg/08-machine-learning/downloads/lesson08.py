# 第8回：訓練平均を固定して評価する。work全体を開いて実行します。
from pathlib import Path
import pandas as pd

source = Path("exercises/lesson08/data/equipment.csv")
records = pd.read_csv(source)
print(records.shape)
print(records.dtypes)
print(records.isna().sum())
train = records[records["split"] == "train"].copy()
validation = records[records["split"] == "validation"].copy()
baseline = train["energy_kwh"].mean()
print("訓練ID", train["id"].tolist())
print("検証ID", validation["id"].tolist())
print("訓練件数", len(train))
print("検証件数", len(validation))
print("訓練平均 kWh", baseline)
train_error = (train["energy_kwh"] - baseline).abs()
train_mae = train_error.mean()
validation_error = (validation["energy_kwh"] - baseline).abs()
validation_mae = validation_error.mean()
print("訓練MAE kWh", train_mae)
print("検証MAE kWh", validation_mae)
