"""第15回 B: 標準化した4測定値でクラスタ数を比較する。"""
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# 必須変更: 主言語・照合言語の両方で 2 を 3 にする。
pd.set_option("display.precision", 16)
k_candidate = 2
features = ["sepal_length_cm", "sepal_width_cm", "petal_length_cm", "petal_width_cm"]
data = pd.read_csv("exercises/lesson15/data/iris.csv")
print(data.head())
print("使用ID:", data["id"].tolist())
print("件数:", len(data))
print("使用列:", features)
X = data[features]
means = X.mean()
sample_sd = X.std(ddof=1)
Z = (X - means) / sample_sd
print("列平均 (cm):", means)
print("標本標準偏差 (cm, 分母n-1):", sample_sd)
initial_ids = {2: ["I001", "I101"], 3: ["I001", "I051", "I101"]}
results = {}
summaries = []
for analysis, k in [("candidate", k_candidate)]:
    chosen = initial_ids[k]
    initial = Z.iloc[[data.index[data["id"] == value][0] for value in chosen]]
    model = KMeans(n_clusters=k, init=initial.to_numpy(), n_init=1,
                   algorithm="lloyd", max_iter=300, tol=1e-10)
    model.fit(Z)
    labels = model.labels_
    centers = pd.DataFrame(model.cluster_centers_, columns=features)
    centers.insert(0, "cluster", range(k))
    distance_sq = ((Z.to_numpy() - model.cluster_centers_[labels]) ** 2).sum(axis=1)
    assignments = pd.DataFrame({"id": data["id"], "cluster": labels, "distance_sq": distance_sq})
    groups = X.assign(cluster=labels).groupby("cluster")
    summary = groups.mean().rename(columns={c: "mean_" + c for c in features})
    summary.insert(0, "n", groups.size())
    summary = summary.reset_index()
    summary.insert(0, "k", k)
    summary.insert(0, "analysis", analysis)
    print(analysis, "k:", k, "初期中心ID:", chosen)
    print("中心 (無次元):")
    print(centers.to_string(index=False, float_format=lambda v: f"{v:.16g}"))
    print("群別件数と元の単位での平均 (cm):")
    print(summary.to_string(index=False, float_format=lambda v: f"{v:.16g}"))
    print("所属と二乗距離:")
    print(assignments.to_string(index=False, float_format=lambda v: f"{v:.16g}"))
    print("群内平方和:", model.inertia_)
    print("独立に足した二乗距離の合計:", distance_sq.sum())
    print("指定行:")
    print(assignments[assignments["id"].isin(["I001", "I051", "I101"])])
    results[analysis] = {"model": model, "assignments": assignments, "summary": summary, "k": k}
    summaries.append(summary)
comparison = pd.concat(summaries, ignore_index=True)
selected = results["candidate"]
print("I001の標準化値 (無次元):", Z.iloc[0])
print("I001から各中心への二乗距離:", ((selected["model"].cluster_centers_ - Z.iloc[0].to_numpy()) ** 2).sum(axis=1))
