"""第13回: 標準化の有無でPCAを比較する。既存のPythonタスクで実行。"""
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from sklearn.decomposition import PCA

# 必須変更: 主言語・照合言語の両方で True にする。
standardize = False
features = ["sepal_length_cm", "sepal_width_cm", "petal_length_cm", "petal_width_cm"]
data = pd.read_csv("exercises/lesson13/data/iris.csv")
print(data.head())
print("使用ID:", data["id"].tolist())
print("件数:", len(data))
print("使用列:", features)
X = data[features]
means = X.mean()
sample_sd = X.std(ddof=1)
print("列平均 (cm):")
print(means)
print("標本標準偏差 (cm, 分母n-1):")
print(sample_sd)

results = {}
variance_tables = []
for analysis, scaled in [("baseline", False), ("candidate", standardize)]:
    # 標準化なしでもPCA自身が列平均を引く。白色化はしない。
    inputs = (X - means) / sample_sd if scaled else X
    model = PCA(n_components=2, svd_solver="full", whiten=False)
    coordinates = model.fit_transform(inputs)
    weights = pd.DataFrame(model.components_.T, index=features, columns=["PC1", "PC2"])
    scores = pd.DataFrame(coordinates, columns=["PC1", "PC2"])
    scores.insert(0, "id", data["id"].to_numpy())
    ratios = model.explained_variance_ratio_
    variance = pd.DataFrame({
        "analysis": analysis, "standardized": scaled, "component": ["PC1", "PC2"],
        "explained_variance_ratio": ratios, "cumulative_ratio": ratios.cumsum(),
    })
    print(analysis, "標準化:", scaled)
    print("係数: 行=元の列、列=主成分")
    print(weights)
    print(variance)
    print(scores.to_string(index=False))
    print("指定行:")
    print(scores[scores["id"].isin(["I001", "I051", "I101"])])
    results[analysis] = {"model": model, "weights": weights, "scores": scores, "scaled": scaled, "ratios": ratios}
    variance_tables.append(variance)

comparison = pd.concat(variance_tables, ignore_index=True)
selected = results["candidate"]
print("I001の標準化値 (無次元):")
print((X.iloc[0] - means) / sample_sd)
print("手計算用: 上の4つの標準化値にcandidateのPC1係数を掛けて合計する。")
# 照合用では保存を要求しない。
