"""第15回 B: 標準化した4測定値でクラスタ数を比較する。"""
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# 必須変更: 主言語・照合言語の両方で 2 を 3 にする。
pd.set_option("display.precision", 16)
k_candidate = 3
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
for analysis, k in [("baseline", 2), ("candidate", k_candidate)]:
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
# 描画用PCAは一度だけ計算する。群分けには4列のZを使う。
pca = PCA(n_components=2, svd_solver="full", whiten=False)
coordinates = pca.fit_transform(Z)
ratios = pca.explained_variance_ratio_
# SAVE_BEGIN
output = Path("exercises/lesson15/output/B")
output.mkdir(parents=True, exist_ok=True)
analysis_table = data[["id", *features]].copy()
for key in ["baseline", "candidate"]:
    analysis_table[key + "_cluster"] = results[key]["assignments"]["cluster"].astype("int64")
    analysis_table[key + "_distance_sq"] = results[key]["assignments"]["distance_sq"]
analysis_table.to_csv(output / "analysis.csv", index=False)
reloaded = pd.read_csv(output / "analysis.csv", float_precision="round_trip")
print("保存後の一致:", analysis_table.equals(reloaded))
fig, axes = plt.subplots(1, 2, figsize=(10, 4.8), sharex=True, sharey=True)
palette = ["#2563eb", "#ea580c", "#15803d"]
for ax, analysis in zip(axes, ["baseline", "candidate"]):
    result = results[analysis]
    for cluster in sorted(set(result["model"].labels_)):
        mask = result["model"].labels_ == cluster
        ax.scatter(coordinates[mask, 0], coordinates[mask, 1], s=18,
                   color=palette[int(cluster)], label=f"cluster {cluster}")
    ax.set_xlabel(f"PC1 (unitless), {ratios[0]:.1%}")
    ax.set_ylabel(f"PC2 (unitless), {ratios[1]:.1%}")
    ax.set_title(f"{analysis}: k={result['k']}, clustering in 4D")
    ax.set_aspect("equal", adjustable="box")
    ax.legend()
fig.tight_layout()
fig.savefig(output / "figure.png", dpi=120)
plt.close(fig)
print("保存先:", output)
# SAVE_END
