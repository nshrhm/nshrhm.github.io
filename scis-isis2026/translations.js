window.SCIS_BILINGUAL_DATA = {
  "1": [
    {
      "en": "Good morning. I am Naruki Shirahama. Today, I will explain how we separate reading-stance and temperature effects in language-model emotion scoring.",
      "ja": "おはようございます。白濱成希です。本日は、言語モデルによる感情スコアリングにおいて、読みの立場と温度の影響をどのように切り分けるかをご説明します。"
    }
  ],
  "2": [
    {
      "en": "A literary text can be approached from different reading stances. We express these stances through persona instructions.",
      "ja": "文学作品には、さまざまな読みの立場から向き合うことができます。本研究では、ペルソナの指示によって、こうした立場を表現します。"
    },
    {
      "en": "Our four personas are a college freshman, a literary scholar, an emotive poet, and an emotionless robot.",
      "ja": "用いた4つのペルソナは、大学1年生、文学研究者、感情豊かな詩人、そして感情を持たないロボットです。"
    },
    {
      "en": "Each model scores interest, surprise, sadness, and anger from zero to one hundred.",
      "ja": "各モデルは、興味、驚き、悲しみ、怒りを、それぞれ0から100までの値で評価します。"
    },
    {
      "en": "These are model outputs under different instructions, not observations of human readers.",
      "ja": "これらは、異なる指示のもとで得られたモデルの出力であり、人間の読者を観察した結果ではありません。"
    },
    {
      "en": "We ask how much the scores change with the stance and with the sampling control.",
      "ja": "読みの立場とサンプリングの制御によって、スコアがどの程度変化するかを調べます。"
    }
  ],
  "3": [
    {
      "en": "This diagram shows the problem with a bundled design. Each persona is paired with only one temperature.",
      "ja": "この図は、2つの条件を組み合わせて固定する設計の問題を示しています。各ペルソナには、1つの温度だけが対応付けられています。"
    },
    {
      "en": "If the output changes, the reading stance and the sampling setting have both changed.",
      "ja": "出力が変わったとしても、読みの立場とサンプリング設定の両方が変わっています。"
    },
    {
      "en": "We cannot assign that difference cleanly to either control.",
      "ja": "その違いを、どちらか一方の制御によるものとして明確に切り分けることはできません。"
    },
    {
      "en": "The problem starts in the design. A more complex analysis cannot recover the missing combinations.",
      "ja": "問題は設計の段階から始まっています。分析を複雑にしても、欠けている組み合わせを取り戻すことはできません。"
    },
    {
      "en": "These labels are schematic categories. They do not specify the personas in our new experiment.",
      "ja": "これらのラベルは模式的なカテゴリーです。今回の新しい実験で用いたペルソナを指定しているわけではありません。"
    }
  ],
  "4": [
    {
      "en": "To address this problem, we vary persona and temperature independently. Persona is a reading stance, and temperature is a sampling control.",
      "ja": "この問題に対処するため、ペルソナと温度を独立に変化させます。ペルソナは読みの立場、温度はサンプリングの制御です。"
    },
    {
      "en": "The rows show four personas. The columns show four temperature settings.",
      "ja": "行は4つのペルソナ、列は4つの温度設定を示しています。"
    },
    {
      "en": "We observe every combination, rather than one temperature for each persona.",
      "ja": "ペルソナごとに1つの温度だけを割り当てるのではなく、すべての組み合わせを観測します。"
    },
    {
      "en": "For each model and text, we repeat each combination five times. The task and response format stay fixed.",
      "ja": "各モデルと作品について、それぞれの組み合わせを5回繰り返します。課題と応答形式は固定します。"
    },
    {
      "en": "Only the reading stance changes in the prompt. Temperature is set separately through the API.",
      "ja": "プロンプト内で変えるのは読みの立場だけです。温度はAPIを通じて別に設定します。"
    },
    {
      "en": "The persona labels are categories, not points on a psychological scale.",
      "ja": "ペルソナのラベルはカテゴリーであり、心理尺度上の点ではありません。"
    },
    {
      "en": "This design lets us describe persona, temperature, and their interaction separately within each model, text, and emotion.",
      "ja": "この設計によって、各モデル・作品・感情の組み合わせの中で、ペルソナ、温度、そして両者の交互作用を分けて記述できます。"
    }
  ],
  "5": [
    {
      "en": "We used six models and three Japanese literary texts, with four personas and four temperature settings.",
      "ja": "6つのモデルと3つの日本語の文学作品を用い、4つのペルソナと4つの温度設定を組み合わせました。"
    },
    {
      "en": "Five repeats per combination produced fourteen hundred and forty responses, containing fifty-seven hundred and sixty emotion scores.",
      "ja": "各組み合わせを5回繰り返し、1,440件の応答を得ました。そこには5,760個の感情スコアが含まれています。"
    },
    {
      "en": "The texts are The Pocket Watch, The Money and the Pistol, and The Tattered Ostrich.",
      "ja": "作品は『懐中時計』『お金とピストル』『ぼろぼろな駝鳥』です。"
    },
    {
      "en": "Each response follows the same structured format.",
      "ja": "すべての応答は、同じ構造化された形式に従います。"
    },
    {
      "en": "Four initially invalid responses were repaired by targeted retries. All other responses were retained.",
      "ja": "最初に無効だった4件の応答は、その対象だけを再試行して修復しました。それ以外の応答はすべて保持しました。"
    },
    {
      "en": "This is a selected panel. It is not a random sample of all models or all literary works.",
      "ja": "これは選定したモデルと作品からなるパネルです。すべてのモデルや文学作品から無作為に抽出した標本ではありません。"
    }
  ],
  "6": [
    {
      "en": "The mean score tells us the reported intensity of an emotion.",
      "ja": "平均スコアは、出力された感情の強さを示します。"
    },
    {
      "en": "Fuzzy entropy asks a different question. We map each score to Low, Medium, and High membership values.",
      "ja": "ファジィエントロピーは、それとは異なる問いに答えます。各スコアをLow、Medium、Highへの所属度に対応付けます。"
    },
    {
      "en": "The resulting entropy describes membership overlap under this fixed specification.",
      "ja": "得られるエントロピーは、この固定した仕様のもとで、所属度の重なりを表します。"
    },
    {
      "en": "We calculate entropy for each response first, then average within the cell. We do not transform the cell mean.",
      "ja": "まず応答ごとにエントロピーを計算し、その後でセル内の平均を取ります。セル平均を変換するのではありません。"
    },
    {
      "en": "A higher entropy value does not mean that a human reader feels more uncertain.",
      "ja": "エントロピーが高いからといって、人間の読者がより強く不確実さを感じているという意味にはなりません。"
    },
    {
      "en": "The two outcomes come from the same responses, but they describe different features. We therefore examine their interaction patterns separately.",
      "ja": "2つの指標は同じ応答から得られますが、異なる特徴を記述します。そのため、それぞれの交互作用のパターンを別々に調べます。"
    }
  ],
  "7": [
    {
      "en": "Interaction means that the temperature pattern depends on the persona.",
      "ja": "交互作用とは、温度による変化のパターンがペルソナに依存することです。"
    },
    {
      "en": "For each model, text, and emotion, we summarize a four-by-four table of cell means.",
      "ja": "各モデル・作品・感情について、4行4列のセル平均表にまとめます。"
    },
    {
      "en": "We separate persona, temperature, and interaction components. B is the share assigned to interaction.",
      "ja": "ペルソナ、温度、交互作用の成分に分けます。Bは、そのうち交互作用に割り当てられる比率です。"
    },
    {
      "en": "A smaller B means that the two contributions are more nearly additive.",
      "ja": "Bが小さいほど、2つの寄与は加法的な関係に近いことを意味します。"
    },
    {
      "en": "This is a descriptive share within that table. It is not a global variance share across models and texts.",
      "ja": "これは、その表の中での記述的な比率です。モデルや作品を横断した全体の分散比率ではありません。"
    }
  ],
  "8": [
    {
      "en": "Now, let’s look at the results, starting with the emotion scores. Persona accounts for most of the decomposed variation.",
      "ja": "ここから結果です。まず感情スコアを見ます。分解した変動の大部分をペルソナが占めています。"
    },
    {
      "en": "Its mean share is above eighty percent for anger and at least ninety percent for the other emotions.",
      "ja": "その平均比率は、怒りでは80%を超え、それ以外の感情では90%以上です。"
    },
    {
      "en": "Temperature shares are smaller. Interaction ranges from 3.4 percent for sadness to 13.2 percent for anger.",
      "ja": "温度の比率はより小さくなっています。交互作用は、悲しみの3.4%から怒りの13.2%までの範囲です。"
    },
    {
      "en": "The score patterns are therefore largely additive within these subtables.",
      "ja": "したがって、これらの個別の表の中では、スコアのパターンはおおむね加法的です。"
    },
    {
      "en": "This describes the selected conditions. It does not mean that temperature never matters.",
      "ja": "これは選定した条件についての記述です。温度が決して重要ではない、という意味ではありません。"
    },
    {
      "en": "The intervals in the reference table describe repeat-level stability, while keeping the models, texts, and design cells fixed.",
      "ja": "補助資料の表にある区間は、モデル、作品、設計上の各セルを固定したまま、反復に伴う安定性を示しています。"
    }
  ],
  "9": [
    {
      "en": "Here we apply the same decomposition to two outcomes: the score and normalized fuzzy entropy.",
      "ja": "ここでは、スコアと正規化ファジィエントロピーという2つの指標に、同じ分解を適用します。"
    },
    {
      "en": "For entropy, we first transform each response's score, then average within the cell.",
      "ja": "エントロピーについては、まず各応答のスコアを変換し、その後でセル内の平均を取ります。"
    },
    {
      "en": "The table shows the interaction share. A larger share means that the two controls are less separable.",
      "ja": "この表は交互作用の比率を示しています。比率が大きいほど、2つの制御を分離しにくいことを意味します。"
    },
    {
      "en": "For anger, the share is 13.2 percent for scores and 28.3 percent for entropy.",
      "ja": "怒りでは、その比率はスコアで13.2%、エントロピーで28.3%です。"
    },
    {
      "en": "For surprise, it is 7.0 percent for scores and 19.8 percent for entropy.",
      "ja": "驚きでは、スコアで7.0%、エントロピーで19.8%です。"
    },
    {
      "en": "The same direction appears in interest and sadness. Each row averages eighteen model-text units.",
      "ja": "興味と悲しみにも同じ方向の傾向が見られます。各行は、18個のモデルと作品の組み合わせにわたる平均です。"
    },
    {
      "en": "These are shares within separate decompositions, not amounts of variation on a common scale.",
      "ja": "これらは、それぞれ別の分解の中での比率です。共通の尺度上で変動量を比較しているわけではありません。"
    },
    {
      "en": "Entropy describes membership overlap under our chosen specification. It does not directly measure human emotional uncertainty.",
      "ja": "エントロピーは、選択した仕様のもとでの所属度の重なりを記述します。人間の感情の不確実さを直接測っているわけではありません。"
    }
  ],
  "10": [
    {
      "en": "This selected score example uses DeepSeek V3.2, Text 3, and sadness.",
      "ja": "この選定したスコアの例は、DeepSeek V3.2、作品3、悲しみの組み合わせです。"
    },
    {
      "en": "The rows show the personas, and the columns show the temperature settings. Each value averages five responses.",
      "ja": "行はペルソナ、列は温度設定を示しています。各値は5件の応答の平均です。"
    },
    {
      "en": "The interaction share is 0.039. Most of the decomposed pattern is therefore additive.",
      "ja": "交互作用の比率は0.039です。したがって、分解したパターンの大部分は加法的です。"
    },
    {
      "en": "This is an illustration of low interaction, not the average result.",
      "ja": "これは交互作用が小さい場合の例であり、平均的な結果ではありません。"
    },
    {
      "en": "Next, we will see a high-interaction entropy example from a different model and emotion.",
      "ja": "次に、別のモデルと感情における、交互作用の大きいエントロピーの例を見ます。"
    }
  ],
  "11": [
    {
      "en": "This is one selected high-interaction case: Claude Sonnet 4.5, Text 3, and anger.",
      "ja": "これは、交互作用が大きいケースとして選んだ1例です。Claude Sonnet 4.5、作品3、怒りの組み合わせです。"
    },
    {
      "en": "Each cell shows normalized fuzzy entropy averaged over five responses. Darker cells indicate larger values.",
      "ja": "各セルは、5件の応答にわたって平均した正規化ファジィエントロピーを示します。色が濃いセルほど値が大きくなっています。"
    },
    {
      "en": "Read from left to right. The robot row falls, while the scholar row first rises and then falls.",
      "ja": "左から右に見てください。ロボットの行は低下しますが、文学研究者の行はいったん上がってから下がります。"
    },
    {
      "en": "The temperature pattern therefore depends on the persona. One common temperature shift cannot describe all rows.",
      "ja": "このように、温度による変化のパターンはペルソナに依存します。すべての行を、1つの共通した温度の効果だけで説明することはできません。"
    },
    {
      "en": "The interaction share is 0.655 in this example. This is not the panel average.",
      "ja": "この例の交互作用の比率は0.655です。これはパネル全体の平均ではありません。"
    },
    {
      "en": "The score example uses a different model and emotion. These examples are illustrations, not a matched comparison.",
      "ja": "先ほどのスコアの例とは、モデルも感情も異なります。これらは例示であり、条件をそろえた比較ではありません。"
    },
    {
      "en": "For the overall score-entropy contrast, use the panel summary. This figure shows what a strong interaction can look like.",
      "ja": "スコアとエントロピーを全体として比較するには、パネルの集計結果を用いてください。この図は、強い交互作用がどのような形で現れ得るかを示しています。"
    }
  ],
  "12": [
    {
      "en": "These results support a design diagnostic within our selected panel.",
      "ja": "これらの結果は、選定したパネルの範囲内で、設計を診断するための根拠になります。"
    },
    {
      "en": "They do not establish agreement with human readers. We did not perform human-reference validation in this study.",
      "ja": "人間の読者との一致を立証するものではありません。本研究では、人間の評価を基準とする検証を行っていません。"
    },
    {
      "en": "Five repeats describe some repeat-level stability, but do not establish that five are sufficient.",
      "ja": "5回の反復から、反復に伴う安定性の一部は記述できます。しかし、5回で十分だと立証したわけではありません。"
    },
    {
      "en": "Temperature values may have different behavioral meanings across providers.",
      "ja": "温度の数値がモデルの挙動に対して持つ意味は、プロバイダーによって異なる可能性があります。"
    },
    {
      "en": "Entropy also depends on the membership specification. Our sensitivity check is not external validation.",
      "ja": "エントロピーは所属関数の仕様にも依存します。今回の感度確認は、外部検証ではありません。"
    },
    {
      "en": "Broader texts, deeper replication, and human-reference studies are needed before extending these conclusions.",
      "ja": "これらの結論をより広く適用するには、作品の範囲を広げ、反復を増やし、人間の評価を基準とする研究を行う必要があります。"
    }
  ],
  "13": [
    {
      "en": "Let me conclude with the main lesson: vary the two controls independently, and examine both outcomes.",
      "ja": "最後に要点をまとめます。二つの制御を独立に変化させ、両方の指標を調べることです。"
    },
    {
      "en": "That makes their separate contributions and interaction observable.",
      "ja": "そうすることで、それぞれの寄与と交互作用を観測できるようになります。"
    },
    {
      "en": "In this study, mean scores were largely persona-driven and nearly additive. Fuzzy entropy retained more interaction.",
      "ja": "本研究では、平均スコアは主にペルソナに左右され、ほぼ加法的でした。一方、ファジィエントロピーには、より大きな交互作用が残りました。"
    },
    {
      "en": "So a stable-looking score pattern does not guarantee the same pattern for a derived descriptor.",
      "ja": "したがって、スコアのパターンが安定して見えても、そこから導いた記述指標に同じパターンが現れるとは限りません。"
    },
    {
      "en": "We recommend specifying the design and the membership family clearly, then interpreting each outcome within those conditions.",
      "ja": "設計と所属関数のファミリーを明示し、その条件の範囲内で各指標を解釈することを勧めます。"
    }
  ],
  "14": [
    {
      "en": "Thank you for listening. We acknowledge support from JSPS KAKENHI. I welcome your questions about the design, results, or limitations.",
      "ja": "ご清聴ありがとうございました。JSPS科研費によるご支援に感謝いたします。設計、結果、限界について、ご質問をお待ちしています。"
    }
  ],
  "15": [
    {
      "en": "This table retains every point estimate and interval from the primary decomposition table.",
      "ja": "この表には、主たる分解結果の表にあるすべての点推定値と区間を載せています。"
    },
    {
      "en": "The intervals describe repeat-level stability within the fixed panel. They are point-centered normal bootstrap intervals.",
      "ja": "これらの区間は、固定したパネル内での反復に伴う安定性を示します。点推定値を中心とする正規近似のブートストラップ区間です。"
    },
    {
      "en": "We resample the five responses within each cell, preserving the four emotions from each response as a block.",
      "ja": "各セル内の5件の応答を再標本化します。その際、1件の応答に含まれる4つの感情を、ひとまとまりとして保持します。"
    },
    {
      "en": "This does not measure uncertainty over all possible texts or models, or establish that five repeats are sufficient.",
      "ja": "これは、考え得るすべての作品やモデルについての不確実さを測るものではなく、5回の反復で十分だと立証するものでもありません。"
    }
  ],
  "16": [
    {
      "en": "These are the manuscript equations. The factors of four follow the balanced four-by-four design.",
      "ja": "これらは論文中の式です。係数の4は、釣り合いの取れた4行4列の設計に由来します。"
    },
    {
      "en": "We use the same decomposition for the mean score and the mean of per-response normalized entropy.",
      "ja": "平均スコアと、応答ごとに求めた正規化エントロピーの平均に、同じ分解を用います。"
    },
    {
      "en": "The denominator includes persona, temperature, and interaction only. Repeat-level variation is handled through bootstrap intervals.",
      "ja": "分母に含めるのは、ペルソナ、温度、交互作用だけです。反復に伴う変動は、ブートストラップ区間を通じて扱います。"
    },
    {
      "en": "The reported panel summaries average these within-unit shares. They are not a pooled global decomposition.",
      "ja": "報告したパネルの集計値は、こうした各単位内の比率を平均したものです。全データを一括した全体の分解ではありません。"
    }
  ],
  "17": [
    {
      "en": "The primary family is sigmoid_s_v1. The displayed definition retains the corrected piecewise-quadratic S-function.",
      "ja": "主に用いる所属関数ファミリーはsigmoid_s_v1です。表示している定義には、修正済みの区分的な2次式によるS字関数を保持しています。"
    },
    {
      "en": "Normalization uses a family-specific maximum on the documented grid, with a step of 0.001.",
      "ja": "正規化には、記録された刻み幅0.001のグリッド上で求めた、ファミリーごとの最大値を用います。"
    },
    {
      "en": "The legacy linear family gives a cell-mean correlation of 0.933, but absolute differences remain.",
      "ja": "従来の線形ファミリーとのセル平均の相関は0.933ですが、値の絶対的な差は残っています。"
    },
    {
      "en": "We therefore compare entropy within a fixed family. This is sensitivity evidence, not validation against human interpretations.",
      "ja": "そのため、エントロピーはファミリーを固定して比較します。これは感度に関する根拠であり、人間の解釈を基準とした妥当性検証ではありません。"
    }
  ],
  "18": [
    {
      "en": "These are the requested API model identifiers used in the experiment, not a list of current model versions.",
      "ja": "これらは、実験時にAPIへ要求したモデル識別子です。現在のモデルバージョンの一覧ではありません。"
    },
    {
      "en": "All models were accessed through OpenRouter. Some returned model identifiers differ from the requested identifiers.",
      "ja": "すべてのモデルにはOpenRouterを通じてアクセスしました。返されたモデル識別子の一部は、要求した識別子と異なります。"
    },
    {
      "en": "The reported times come from saved response-creation metadata. They are not local request timestamps.",
      "ja": "報告した時刻は、保存済みの応答作成メタデータに基づきます。ローカルでリクエストを送信した時刻ではありません。"
    },
    {
      "en": "We do not infer underlying providers or immutable model snapshots from these labels.",
      "ja": "これらのラベルから、背後のプロバイダーや、固定された不変のモデルスナップショットを推定することはしません。"
    }
  ],
  "19": [
    {
      "en": "This figure summarizes mean interaction burden for each display model, averaging over texts and emotions.",
      "ja": "この図は、表示名ごとのモデルについて、作品と感情にわたって平均した交互作用の負担をまとめたものです。"
    },
    {
      "en": "The score and entropy columns describe different outcomes under the same design.",
      "ja": "スコアとエントロピーの列は、同じ設計のもとで得られた異なる指標を示しています。"
    },
    {
      "en": "The figure is descriptive. A lower interaction share is not evidence of greater emotional accuracy or closer agreement with people.",
      "ja": "この図は記述的なものです。交互作用の比率が小さいことは、感情評価の精度が高いことや、人間との一致が強いことの証拠ではありません。"
    }
  ],
  "20": [
    {
      "en": "Four responses were initially invalid. We retried only those failed rows and kept the original output unchanged.",
      "ja": "最初に無効だった応答は4件でした。失敗した行だけを再試行し、元の出力は変更せずに保持しました。"
    },
    {
      "en": "No valid observations were rerun or selectively filtered. The repaired file had complete structured-output validity.",
      "ja": "有効な観測を再実行したり、選択的に除外したりはしていません。修復後のファイルでは、すべての応答が構造化出力としての有効性を満たしました。"
    },
    {
      "en": "Validity here means parseable scores in range and the required fields. It does not mean that the emotional interpretation is correct.",
      "ja": "ここでの有効性とは、範囲内のスコアを解析でき、必要な項目がそろっていることを意味します。感情の解釈が正しいという意味ではありません。"
    },
    {
      "en": "Deeper replication, broader texts, human-reference comparison, and external membership validation remain future work.",
      "ja": "反復を増やすこと、作品の範囲を広げること、人間の評価との比較、所属関数の外部検証は、今後の課題です。"
    }
  ]
};
