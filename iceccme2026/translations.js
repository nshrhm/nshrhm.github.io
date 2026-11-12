window.ICECCME_BILINGUAL_DATA = {
  "1": [
    {
      "en": "Good morning. I am Naruki Shirahama. We compare six models with Japanese readers. This is a compact screening study.",
      "ja": "おはようございます。白濱成希です。6モデルを日本語の読者評価と比較する、小規模なスクリーニング研究です。"
    }
  ],
  "3": [
    {
      "en": "When people read a story, they may feel interest, surprise, sadness, or anger. We ask how closely AI scores match those reader ratings.",
      "ja": "物語を読むと、興味、驚き、悲しみ、怒りを感じることがあります。AIの得点が読者の評価にどれほど近いかを調べます。"
    },
    {
      "en": "The left path is our main experiment. Students read Japanese texts and rated their emotions. Models scored the same works in Japanese.",
      "ja": "左側が主実験です。学生は日本語の作品を読み、感情を評価しました。モデルも同じ作品を日本語で評価しました。"
    },
    {
      "en": "We then compared the model averages with the human averages. The human ratings are our reference.",
      "ja": "次に、モデルと人間の平均値を比較しました。人間の評価を参照基準とします。"
    },
    {
      "en": "The right path asks a different question. We changed the text and instructions to English or Chinese and compared each model with itself.",
      "ja": "右側では別の問いを扱います。本文と指示を英語または中国語に変え、各モデルを同じモデル自身と比較しました。"
    },
    {
      "en": "There are no English or Chinese human ratings here. Stable scores can still disagree with readers.",
      "ja": "英語・中国語の人間による評価はありません。得点が安定していても、読者の評価とは一致しない場合があります。"
    }
  ],
  "4": [
    {
      "en": "To answer these two questions, we compare the scores in two ways. We use three works and four emotions: interest, surprise, sadness, and anger.",
      "ja": "この2つの問いに答えるため、得点を2通りの方法で比較します。3作品と、興味・驚き・悲しみ・怒りの4感情を用います。"
    },
    {
      "en": "Scores range from zero to one hundred. We collected ninety-one student responses, with eighty-six to ninety-one usable ratings per cell.",
      "ja": "得点は0〜100です。学生から91件の回答を集め、各セルで86〜91件の評価が利用できました。"
    },
    {
      "en": "Six models scored three languages and three works, with ten repetitions. We used one neutral-reader task at temperature zero point four.",
      "ja": "6モデルが3言語・3作品を10回ずつ評価しました。中立的な読者としての課題を1種類用い、温度は0.4としました。"
    },
    {
      "en": "The April seventeen to nineteen, twenty twenty-six collection produced five hundred forty valid runs and two thousand one hundred sixty scores.",
      "ja": "2026年4月17〜19日の収集で、有効な実行540件、感情得点2,160件を得ました。"
    },
    {
      "en": "Ninety rows needed retries. No scores were imputed.",
      "ja": "90行で再試行が必要でした。得点の欠損補完は行っていません。"
    }
  ],
  "prompt": [
    {
      "en": "Here is the task sentence from the saved English request. The model received the full work, not a summary.",
      "ja": "保存された英語リクエストの課題文です。モデルには要約ではなく、作品全文を提示しました。"
    },
    {
      "en": "The role was a neutral reader. We asked for emotions after reading the whole work, not labels for individual sentences.",
      "ja": "役割は中立的な読者です。個々の文へのラベルではなく、作品全体を読んだ後の感情を尋ねました。"
    },
    {
      "en": "Zero means not felt at all. Fifty means moderately felt. One hundred means extremely strongly felt.",
      "ja": "0は「まったく感じない」、50は「中程度に感じる」、100は「極めて強く感じる」を意味します。"
    },
    {
      "en": "The requested answer was one JSON object with four integer scores and brief reasons grounded in the text.",
      "ja": "回答は1つのJSONオブジェクトとし、4つの整数得点と、本文に基づく簡潔な理由を求めました。"
    },
    {
      "en": "The figures analyze the scores. They do not evaluate the quality of the explanations.",
      "ja": "図で分析するのは得点です。説明の質は評価していません。"
    }
  ],
  "5": [
    {
      "en": "We average ten repetitions per cell. Both distances average absolute differences over twelve cells.",
      "ja": "各セルの10回の反復を平均します。2つの距離指標はいずれも、12セルの絶対差を平均します。"
    },
    {
      "en": "MAE means mean absolute error. It compares Japanese model and human means. Drift uses the same model’s Japanese means as reference.",
      "ja": "MAEは平均絶対誤差です。日本語でのモデル平均と人間平均を比較します。ドリフトは同じモデルの日本語平均を基準とします。"
    },
    {
      "en": "Average drift is the mean of English and Chinese drift. Lower values mean closer agreement or less change, respectively.",
      "ja": "平均ドリフトは英語・中国語のドリフトの平均です。値が小さいほど、それぞれ一致度が高い、または変化が小さいことを示します。"
    },
    {
      "en": "We used ten thousand cluster-bootstrap replicates and ninety-five percent percentile intervals.",
      "ja": "クラスターブートストラップを10,000回行い、95%パーセンタイル区間を求めました。"
    },
    {
      "en": "Respondents and runs were resampled independently. Each run keeps four emotions together.",
      "ja": "回答者とモデルの実行は独立に再標本化しました。各実行の4感情はまとめて扱います。"
    },
    {
      "en": "Each replicate uses the same human profile for all models. Intervals are conditional on twelve fixed cells, not new works.",
      "ja": "各反復で、全モデルに同じ人間評価プロファイルを使います。区間は固定された12セルを条件とし、新しい作品を対象としません。"
    },
    {
      "en": "We also omit each story and emotion separately to check composition sensitivity.",
      "ja": "各作品と各感情を1つずつ除外し、構成に対する感度も確認します。"
    }
  ],
  "7": [
    {
      "en": "Now, let’s look at the results, starting with agreement with Japanese readers. Look at the left panel of Figure 2. Lower MAE means closer agreement.",
      "ja": "結果を見ます。まず日本語の読者評価との一致です。図2の左パネルでは、MAEが小さいほど一致度が高くなります。"
    },
    {
      "en": "Among the top four models, every pairwise MAE-difference interval includes zero.",
      "ja": "上位4モデルでは、すべてのペアのMAE差の区間が0を含みます。"
    },
    {
      "en": "This fixed benchmark does not resolve a unique best model. This does not show equivalence.",
      "ja": "この固定ベンチマークでは、単独の最良モデルを特定できません。同等性を示したわけでもありません。"
    }
  ],
  "8": [
    {
      "en": "Now look at the right panel. Signed error is model mean minus Japanese human mean.",
      "ja": "次に右パネルです。符号付き誤差は、モデル平均から日本語の人間平均を引いた値です。"
    },
    {
      "en": "T3 sadness is the largest shared error. All six models overestimate it. Its mean absolute error across models is 48.525.",
      "ja": "T3の悲しみは、共通する最大の誤差です。全6モデルが過大評価し、6モデルで平均した絶対誤差は48.525です。"
    },
    {
      "en": "All six underestimate T2 sadness and overestimate T2 surprise. Their mean absolute errors are 39.083 and 33.860, respectively.",
      "ja": "全6モデルがT2の悲しみを過小評価し、T2の驚きを過大評価しました。平均絶対誤差は、それぞれ39.083と33.860です。"
    },
    {
      "en": "All six also underestimate T1 sadness. The direction depends on the story.",
      "ja": "全6モデルがT1の悲しみも過小評価しました。誤差の方向は作品によって異なります。"
    },
    {
      "en": "All seven omissions changed the full order: three stories and four emotions. These checks show sensitivity, not a causal explanation.",
      "ja": "3作品と4感情の計7通りの除外すべてで、全体の順位が変わりました。これは感度を示し、因果的な説明ではありません。"
    }
  ],
  "9": [
    {
      "en": "Now, our second question: how much do scores change across languages? Lower drift means less change from each model’s Japanese scores.",
      "ja": "次は2つ目の問いです。言語を変えると得点はどれほど変わるでしょうか。ドリフトが小さいほど、各モデルの日本語得点からの変化が小さくなります。"
    },
    {
      "en": "Both text and instructions change language. Drift does not measure agreement with English or Chinese readers.",
      "ja": "本文と指示の両方の言語を変えています。ドリフトは、英語・中国語の読者との一致度を測るものではありません。"
    },
    {
      "en": "These conditions do not isolate language, translation, or cultural effects.",
      "ja": "これらの条件では、言語・翻訳・文化の効果を切り分けられません。"
    }
  ],
  "10": [
    {
      "en": "Compare the MAE and average-drift columns.",
      "ja": "MAEと平均ドリフトの列を比較してください。"
    },
    {
      "en": "Claude Sonnet 4.5 and DeepSeek V3.2 have the lowest MAE point estimates: 20.026 and 20.100. They lead in bootstrap rank stability.",
      "ja": "Claude Sonnet 4.5とDeepSeek V3.2のMAE点推定値が最小で、20.026と20.100です。ブートストラップでの順位安定性でも上位です。"
    },
    {
      "en": "The top four span only 1.087 points. Their pairwise difference intervals include zero.",
      "ja": "上位4モデルの差はわずか1.087点です。各ペアの差の区間は0を含みます。"
    },
    {
      "en": "Qwen3.6 Plus and GPT-5.4 have the lowest average drift: 3.346 and 3.354. DeepSeek’s is 6.396.",
      "ja": "Qwen3.6 PlusとGPT-5.4の平均ドリフトが最小で、3.346と3.354です。DeepSeekは6.396です。"
    },
    {
      "en": "Gemini 2.5 Pro has MAE 28.952 despite moderate drift. On this fixed benchmark, its MAE exceeds the other five models.",
      "ja": "Gemini 2.5 Proはドリフトが中程度でも、MAEは28.952です。この固定ベンチマークでは、他の5モデルよりMAEが大きくなっています。"
    },
    {
      "en": "Correlations are exploratory over twelve cells, not stable model traits.",
      "ja": "相関は12セルに基づく探索的な結果であり、安定したモデル特性ではありません。"
    },
    {
      "en": "The two axes give different orderings. This is a screening map, not a combined deployment score.",
      "ja": "2つの軸で順位は異なります。これはスクリーニング用のマップであり、実運用のための統合得点ではありません。"
    }
  ],
  "11": [
    {
      "en": "Let me conclude with the main lesson: human agreement and stability need separate evaluation. This study gives us a practical starting point.",
      "ja": "結論です。人間との一致と安定性は、別々に評価する必要があります。本研究は、実践的な出発点を提供します。"
    },
    {
      "en": "Read average scores together with uncertainty, cell errors, and composition sensitivity. Our results do not establish a definitive model ranking.",
      "ja": "平均得点は、不確実性、セルごとの誤差、構成に対する感度と併せて読みます。本結果は、確定的なモデル順位を示しません。"
    },
    {
      "en": "Use this compact benchmark for stage-one screening. It does not approve a model for deployment.",
      "ja": "この小規模ベンチマークは第1段階のスクリーニングに使います。モデルの実運用を承認するものではありません。"
    },
    {
      "en": "The next step is broader validation with more works, readers, prompts, and matched multilingual human references.",
      "ja": "次の段階は、作品・読者・プロンプトを増やし、対応する多言語の人間評価を用いた、より広い検証です。"
    }
  ],
  "13": [
    {
      "en": "We thank the student readers and acknowledge Aozora Bunko.",
      "ja": "読者として参加した学生の皆さんに感謝し、青空文庫に謝意を表します。"
    },
    {
      "en": "JSPS KAKENHI partially supported this work: grants 26K14983 and 24K13350.",
      "ja": "本研究はJSPS科研費26K14983および24K13350の助成を一部受けました。"
    },
    {
      "en": "Thank you. Questions?",
      "ja": "ありがとうございました。ご質問をどうぞ。"
    }
  ],
  "qa-prompt": [
    {
      "en": "These are selected excerpts from the saved English request. The full request also contains the work, scale anchors, and output instructions.",
      "ja": "保存された英語リクエストの抜粋です。完全なリクエストには、作品、尺度の基準、出力指示も含まれます。"
    },
    {
      "en": "The definitions specify the four dimensions. They are the experimental wording, not a general theory of emotion.",
      "ja": "この定義は4つの評価次元を指定します。実験で用いた表現であり、感情の一般理論ではありません。"
    },
    {
      "en": "One neutral-reader task was used. We did not compare different reader personas in this study.",
      "ja": "中立的な読者としての課題を1種類用いました。本研究では、異なる読者ペルソナを比較していません。"
    }
  ],
  "qa-t1": [
    {
      "en": "This is the fixed English text used for T1. The original work is by Kyusaku Yumeno.",
      "ja": "T1で使用した固定の英語本文です。原作は夢野久作です。"
    },
    {
      "en": "The model received the complete text. This display is for discussion; I will not read every line aloud.",
      "ja": "モデルには全文を提示しました。この表示は議論用であり、全行を読み上げることはしません。"
    }
  ],
  "qa-t2-1": [
    {
      "en": "This is the first part of the fixed English text for T2, by Kyusaku Yumeno.",
      "ja": "夢野久作の作品T2で使用した、固定の英語本文の前半です。"
    },
    {
      "en": "The split is only for readability on the screen. The experiment supplied the complete work in one request.",
      "ja": "画面で読みやすくするために分割しています。実験では、作品全文を1回のリクエストで提示しました。"
    }
  ],
  "qa-t2-2": [
    {
      "en": "This is the rest of the fixed English text for T2, by Kyusaku Yumeno.",
      "ja": "夢野久作の作品T2で使用した、固定の英語本文の後半です。"
    },
    {
      "en": "This text provides context for questions. Our cell-error analysis does not establish why the models differed from readers.",
      "ja": "この本文は質疑のための背景資料です。セル誤差の分析では、モデルと読者の評価が異なる理由は特定できません。"
    }
  ],
  "qa-t3": [
    {
      "en": "This is the fixed English text for T3, by Kotaro Takamura. The line breaks follow the experimental text.",
      "ja": "高村光太郎の作品T3で使用した、固定の英語本文です。改行は実験時の本文に従っています。"
    },
    {
      "en": "All six models overestimated sadness in the Japanese condition. Showing this English text does not explain that error or validate the translation.",
      "ja": "日本語条件では全6モデルが悲しみを過大評価しました。この英語本文の提示は、その誤差の説明にも、翻訳の妥当性の検証にもなりません。"
    }
  ],
  "qa-limits": [
    {
      "en": "Our pilot covers three works, four emotions, one student population, six models, and one neutral prompt. Readers were not stratified by demographics.",
      "ja": "本予備研究は3作品、4感情、1つの学生集団、6モデル、1種類の中立的プロンプトを対象とします。読者は人口統計属性で層別化していません。"
    },
    {
      "en": "We lack matched English and Chinese human ratings. Fixed translations were team-checked, not independently validated.",
      "ja": "対応する英語・中国語の人間評価はありません。固定翻訳はチーム内で確認しましたが、独立した検証は行っていません。"
    },
    {
      "en": "The translation system, version, and date were not recorded. We cannot separate language, translation, and cultural effects.",
      "ja": "翻訳システム、バージョン、日付は記録されていません。言語・翻訳・文化の効果を分離できません。"
    },
    {
      "en": "Provider routes and model aliases were unpinned. Exact API replay may change.",
      "ja": "プロバイダーの経路とモデルの別名は固定していません。同じAPI呼出しを再現しても、結果が変わる可能性があります。"
    },
    {
      "en": "Conditional intervals do not generalize to new works, emotions, readers, prompts, providers, languages, or models.",
      "ja": "条件付き区間は、新しい作品・感情・読者・プロンプト・プロバイダー・言語・モデルには一般化できません。"
    },
    {
      "en": "Report uncertainty, cell errors, and composition sensitivity alongside rankings.",
      "ja": "順位と併せて、不確実性、セルごとの誤差、構成に対する感度を報告します。"
    },
    {
      "en": "This is stage-one screening, not deployment approval. Broader validation needs more works, readers, prompts, and matched multilingual human references.",
      "ja": "これは第1段階のスクリーニングであり、実運用の承認ではありません。より広い検証には、作品・読者・プロンプトと、対応する多言語の人間評価の拡充が必要です。"
    }
  ]
};
