window.ICICIC_BILINGUAL_DATA = {
  "opening": [
    {
      "en": "Hello. I am Naruki Shirahama. We ask AI to rate emotions in text, and study what its scores can tell us.",
      "ja": "こんにちは。白浜成希です。AIに文章に関する感情を評価させ、その得点から何がわかるかを調べます。"
    }
  ],
  "emotion-task": [
    {
      "en": "Let us start with a short story. A girl waits for her friend. Only the reader knows that her friend will not come.",
      "ja": "短い場面から始めます。少女が友達を待っています。その友達が来ないことを知っているのは、読者だけです。"
    },
    {
      "en": "This is an example for explanation. It was not used in our experiments, and we have not assigned any scores to it.",
      "ja": "これは説明用の創作例です。実験には使っておらず、この例に得点も付けていません。"
    },
    {
      "en": "Our task asks a language model to read a text and rate four emotions: interest, surprise, sadness, and anger.",
      "ja": "私たちの課題では、言語モデルに文章を読ませ、興味・驚き・悲しみ・怒りの4つの感情を評価させます。"
    },
    {
      "en": "Each score runs from zero to one hundred. Zero means absent. One hundred means extremely strong.",
      "ja": "各得点は0から100です。0は感情がないこと、100は非常に強いことを意味します。"
    },
    {
      "en": "The four scores are separate. They do not need to add up to one hundred. We study these model outputs.",
      "ja": "4つの得点は別々です。合計を100にする必要はありません。私たちが調べるのは、このモデルの出力です。"
    }
  ],
  "scene-targets": [
    {
      "en": "Before asking for scores, we need to decide whose emotions we mean. The reader and the girl are different targets.",
      "ja": "得点を求める前に、誰の感情なのかを決める必要があります。読者と少女は、異なる評価対象です。"
    },
    {
      "en": "The reader knows that the friend will not come. The girl is still waiting. They do not have the same information.",
      "ja": "読者は友達が来ないと知っています。少女はまだ待っています。両者が持つ情報は同じではありません。"
    },
    {
      "en": "We can ask the model about the reader after the whole text. Or we can ask about the character in the text.",
      "ja": "文章全体を読んだ後の読者について、モデルに尋ねることができます。また、文章中の登場人物について尋ねることもできます。"
    },
    {
      "en": "Both questions use the same four emotions and the same scale. We are changing the evaluation target.",
      "ja": "どちらの問いでも、同じ4感情と同じ尺度を使います。変えるのは評価対象です。"
    },
    {
      "en": "We do not give this story one correct emotional answer. In our experiments, both sets of ratings come from AI, not human participants.",
      "ja": "この場面に一つの正しい感情を指定するわけではありません。実験では、どちらの評価も人間の参加者ではなくAIから得ます。"
    }
  ],
  "eq-fuzzy": [
    {
      "en": "Now we can introduce EQ-Fuzzy. In this study, it is a way to describe the emotion scores produced by a language model.",
      "ja": "ここでEQ-Fuzzyを紹介します。この研究では、言語モデルが出す感情スコアの特徴を記述する方法です。"
    },
    {
      "en": "The model produces the ratings. We repeat the task, keep the scores, and describe their behavior.",
      "ja": "評価を出すのはモデルです。課題を繰り返し、得点を保存して、その振る舞いを記述します。"
    },
    {
      "en": "One question is whether repeated scores change. Another is how a score belongs to Low, Medium, and High categories.",
      "ja": "一つの問いは、繰り返した得点が変動するかです。もう一つは、得点がLow・Medium・Highの区分にどのように属するかです。"
    },
    {
      "en": "We also compare the reader and character ratings. I will explain the category overlap with a diagram shortly.",
      "ja": "読者と登場人物の評価も比べます。区分の重なりについては、この後で図を使って説明します。"
    },
    {
      "en": "These descriptions answer different questions. We do not combine them into one score of intelligence or emotional ability.",
      "ja": "これらの記述は、それぞれ異なる問いに答えます。知能や感情的能力を表す一つの得点にまとめることはしません。"
    }
  ],
  "benchmark-question": [
    {
      "en": "A benchmark is a set of tasks with a scoring rule. Its score tells us how well the answers meet that rule.",
      "ja": "ベンチマークは、課題と採点方法の組です。その得点は、答えが採点基準をどれだけ満たしたかを示します。"
    },
    {
      "en": "For example, selected EmoBench questions ask for answers that can be checked as correct or incorrect.",
      "ja": "例えば、今回選んだEmoBenchの設問では、答えが正しいかどうかを確認できます。"
    },
    {
      "en": "This is useful information. We ask an additional question: if systems have the same task score, do their emotion outputs look the same?",
      "ja": "これは有用な情報です。私たちは、同じ課題得点のシステムでも感情の出力は同じように見えるのか、という問いを加えます。"
    },
    {
      "en": "EQ-Fuzzy provides descriptions to examine alongside the task score. It does not replace the benchmark.",
      "ja": "EQ-Fuzzyは、課題得点と併せて調べるための記述を提供します。ベンチマークを置き換えるものではありません。"
    }
  ],
  "evidence-paths": [
    {
      "en": "We use two separate tasks with the same six requested model names. The inputs and settings differ.",
      "ja": "同じ6つのモデル名を指定して、二つの別々の課題を使います。入力と設定は異なります。"
    },
    {
      "en": "One task uses selected benchmark questions. The other asks for emotion ratings on three English literary texts.",
      "ja": "一方は選択したベンチマーク設問です。もう一方は、3つの英語文学作品について感情を評価する課題です。"
    },
    {
      "en": "For each literary text and target, we repeat the ratings ten times. These outputs provide the descriptors on the next slide.",
      "ja": "文学作品ごと、評価対象ごとに10回評価を繰り返します。その出力から、次のスライドの指標を得ます。"
    },
    {
      "en": "The texts and protocols differ. The descriptors do not describe the benchmark answers themselves.",
      "ja": "文章と実験条件は異なります。ここでの指標は、ベンチマークの答え自体を記述したものではありません。"
    }
  ],
  "same-score": [
    {
      "en": "Here is the first result. These four configurations each answered nine of twelve selected EmoBench questions correctly.",
      "ja": "最初の結果です。この4構成は、選択したEmoBenchの12問中9問に、それぞれ正答しました。"
    },
    {
      "en": "The bars show their outputs on the separate three-text task. Start with the left panel: how much did repeated scores vary?",
      "ja": "棒グラフは、別の3作品の課題における出力を示します。まず左側を見てください。繰り返した得点がどれだけ変動したかです。"
    },
    {
      "en": "We summarize that variation with standard deviation, or SD. DeepSeek has a larger value here than Grok.",
      "ja": "この変動を標準偏差、SDで要約します。ここでは、DeepSeekの値がGrokより大きくなっています。"
    },
    {
      "en": "The right panel shows the size of the reader–character difference. Claude has a larger mean absolute difference than Grok.",
      "ja": "右側は、読者と登場人物の差の大きさです。Claudeの平均絶対差はGrokより大きくなっています。"
    },
    {
      "en": "We are describing these recorded outputs, not choosing a winner. Routing and target identity also limit the interpretation.",
      "ja": "記録された出力を記述しているのであり、勝者を選んでいるわけではありません。経路や対象人物の同定も解釈上の制約です。"
    },
    {
      "en": "The main point is that the tied task score does not tell us these patterns. Full values and conditional intervals are in the backup slides.",
      "ja": "要点は、同じ課題得点からはこれらのパターンがわからないことです。全数値と条件付き区間は補足スライドにあります。"
    }
  ],
  "fuzzy-categories": [
    {
      "en": "Before the second result, let us look at the word fuzzy. We describe intensity using Low, Medium, and High categories.",
      "ja": "二つ目の結果の前に、fuzzyという言葉を見てみます。強さをLow・Medium・Highという区分で表します。"
    },
    {
      "en": "These categories can overlap. A score can belong partly to more than one category under the chosen membership rules.",
      "ja": "これらの区分は重なることがあります。決められた所属の規則の下で、得点は複数の区分に部分的に属することがあります。"
    },
    {
      "en": "The diagram only illustrates overlap. It does not show our exact curves or measured scores.",
      "ja": "この図は重なりを説明するためのものです。実際の曲線や測定された得点を示してはいません。"
    },
    {
      "en": "Our fuzzy-entropy descriptor summarizes this membership ambiguity. It depends on the specified membership rules.",
      "ja": "ファジィエントロピーという指標は、この所属の曖昧さを要約します。その値は、指定した所属の規則に依存します。"
    },
    {
      "en": "This differs from asking whether repeated scores change. The same value can repeat while its category membership remains ambiguous.",
      "ja": "これは、繰り返した得点が変動するかという問いとは異なります。同じ値が繰り返されても、区分への所属の曖昧さは残りえます。"
    },
    {
      "en": "It does not measure the model's confidence or a human reader's psychological uncertainty.",
      "ja": "これは、モデルの自信や人間の読者の心理的な不確かさを測るものではありません。"
    }
  ],
  "broader-check": [
    {
      "en": "We also used a separate panel of twelve stimuli: sentences, comments, and dialogues from three sources.",
      "ja": "さらに、3種類の出典から文・コメント・対話を選び、別の12刺激のパネルを使いました。"
    },
    {
      "en": "All analysis text was English. We fixed the focal persons and provider routes, and planned five repeats per cell.",
      "ja": "分析に使った文章はすべて英語です。対象人物とプロバイダー経路を固定し、各セルで5回の反復を計画しました。"
    },
    {
      "en": "There were seven hundred twenty attempts and seven hundred fourteen valid responses. Missing responses were not filled in.",
      "ja": "試行は720件、有効な応答は714件でした。欠測を補うことはしていません。"
    },
    {
      "en": "This broadens the material, but it remains a selected fixed panel. We do not pool it with the original three texts.",
      "ja": "素材の幅は広がりますが、選択した固定パネルであることは変わりません。元の3作品とは合算しません。"
    }
  ],
  "stable-ambiguous": [
    {
      "en": "Here is the second result. In seventy-two of five hundred seventy-two available emotion cells, repeated scores were identical.",
      "ja": "二つ目の結果です。利用可能な572感情セルのうち72セルで、繰り返された得点が同一でした。"
    },
    {
      "en": "Each cell holds one emotion, one target, one stimulus, and one configuration fixed.",
      "ja": "各セルでは、感情・評価対象・刺激・構成を一つずつ固定しています。"
    },
    {
      "en": "The variation was zero. Yet membership ambiguity was positive under our Low, Medium, and High rules.",
      "ja": "変動はゼロでした。それでも、私たちのLow・Medium・Highの規則の下では、所属の曖昧さは正の値でした。"
    },
    {
      "en": "Repeating the same value does not change how it belongs to the categories. The two descriptions therefore tell us different things.",
      "ja": "同じ値を繰り返しても、区分への属し方は変わりません。そのため、二つの記述は異なることを伝えます。"
    },
    {
      "en": "This is a result for the observed repeats. It does not guarantee that future outputs will be identical.",
      "ja": "これは観測した反復についての結果です。将来の出力も同一になると保証するものではありません。"
    }
  ],
  "take-home": [
    {
      "en": "We can now answer our opening question. A task score and an output description tell us different things.",
      "ja": "最初の問いに戻ります。課題の得点と出力の記述は、異なることを伝えます。"
    },
    {
      "en": "The same task score can go with different variation and target differences. Stable scores can still have ambiguous category memberships.",
      "ja": "同じ課題得点でも、変動や評価対象間の差は異なりえます。安定した得点でも、区分への所属は曖昧でありえます。"
    },
    {
      "en": "These descriptions suggest what to inspect next: repeatability, category mapping, or the evaluation target.",
      "ja": "これらの記述は、次に何を点検するかを示します。反復の安定性、区分への対応、あるいは評価対象です。"
    },
    {
      "en": "EQ-Fuzzy helps us ask these follow-up questions alongside the benchmark score. These are not tests of correctness.",
      "ja": "EQ-Fuzzyは、ベンチマーク得点と併せて、こうした追加の問いを立てる助けになります。これらは正しさの検定ではありません。"
    }
  ],
  "scope": [
    {
      "en": "Our findings describe selected texts and recorded configurations. Model and provider effects remain combined.",
      "ja": "今回の結果は、選択した文章と記録済みの構成についての記述です。モデルとプロバイダーの影響は分離されていません。"
    },
    {
      "en": "We did not test agreement with human emotion ratings. We do not claim a model ranking or generalization to all texts.",
      "ja": "人間の感情評価との一致は検証していません。モデルの順位や、あらゆる文章への一般化は主張しません。"
    },
    {
      "en": "The backup slides retain the intervals, missingness, and full conditions for discussion.",
      "ja": "議論のため、補足には区間、欠測、詳しい条件を残しています。"
    }
  ],
  "closing": [
    {
      "en": "Thank you for listening. I welcome your questions.",
      "ja": "ご清聴ありがとうございました。ご質問をお待ちしています。"
    }
  ],
  "targets": [
    {
      "en": "To answer our question, we first need to say whose emotions we ask the model to rate.",
      "ja": "この問いに答えるために、まず、誰の感情をモデルに評価させるかを明確にします。"
    },
    {
      "en": "On the left, the model rates what a reader might feel after reading the whole text.",
      "ja": "左側では、文章全体を読んだ読者がどのような感情を抱くかを、モデルが評価します。"
    },
    {
      "en": "On the right, it rates the emotions of the focal character or speaker. These are two evaluation targets.",
      "ja": "右側では、中心となる登場人物や話者の感情を評価します。この二つが評価対象です。"
    },
    {
      "en": "For each target, the model gives four scores: interest, surprise, sadness, and anger. Each score runs from zero to one hundred.",
      "ja": "各対象について、興味、驚き、悲しみ、怒りを、それぞれ0から100で評価します。"
    },
    {
      "en": "The four scores do not have to add up to one hundred. They are model outputs, not human ratings.",
      "ja": "4つのスコアの合計を100にする必要はありません。これらはモデルの出力であり、人間による評定ではありません。"
    }
  ],
  "descriptors": [
    {
      "en": "These are four views of the outputs. SD measures variation across repeated scores within a fixed condition.",
      "ja": "これは出力を見る4つの視点です。SDは、固定した条件で繰り返した得点の変動を測ります。"
    },
    {
      "en": "Second, fuzzy entropy describes ambiguity under the chosen Low, Medium, and High memberships. It is not the model's confidence.",
      "ja": "次に、ファジィエントロピーは、採用した低・中・高の所属関数の下での曖昧さを記述します。モデルの確信度ではありません。"
    },
    {
      "en": "Third, profile entropy describes relative evenness across the four emotions. It does not measure absolute intensity.",
      "ja": "3つ目のプロファイルエントロピーは、4感情間の相対的な均等さを記述します。絶対的な強度は測りません。"
    },
    {
      "en": "Finally, we compare reader and character means. Signed differences show direction. Absolute differences show magnitude.",
      "ja": "最後に、読者側と登場人物側の平均値を比較します。符号付きの差は方向を、絶対値は大きさを示します。"
    },
    {
      "en": "We keep these views separate. We do not combine them into one quality score.",
      "ja": "これらの見方は分けて扱います。一つの品質得点にはまとめません。"
    }
  ],
  "definitions": [
    {
      "en": "The order and weights matter. SD uses the population formula within each available emotion cell, followed by equal cell weights.",
      "ja": "計算順序と重みが重要です。SDは利用可能な感情セル内で母標準偏差の式を用い、その後、セルを等重みで平均します。"
    },
    {
      "en": "For fuzzy entropy, we transform each score through the fixed membership functions before averaging. We do not take the entropy of a mean score.",
      "ja": "ファジィエントロピーでは、平均する前に各スコアを固定した所属関数で変換します。平均スコアのエントロピーを取るわけではありません。"
    },
    {
      "en": "Profile entropy instead uses equal response weights. An all-zero vector is assigned zero, as is a single-positive-emotion profile.",
      "ja": "プロファイルエントロピーでは、応答を等重みで扱います。全成分ゼロのベクトルにも、1感情だけが正のプロファイルにもゼロを割り当てます。"
    },
    {
      "en": "Target shifts require both targets. We average signed and absolute contrasts separately. Empty cells remain missing.",
      "ja": "対象間シフトには両方の対象が必要です。符号付きの差と絶対値を分けて平均します。空のセルは欠測のままです。"
    }
  ],
  "protocols": [
    {
      "en": "The study uses three separate protocols. The first repeats emotion ratings on three English literary texts.",
      "ja": "この研究は三つの別個の実験を使います。最初は、3つの英語文学作品について感情評価を繰り返す実験です。"
    },
    {
      "en": "The second checks selected EQ-Bench and EmoBench items. These items are not matched to the literary texts.",
      "ja": "2つ目は、EQ-BenchとEmoBenchから選んだ項目を評価します。これらの項目は文学作品と対応していません。"
    },
    {
      "en": "The third adds a separate panel of twelve stimuli. It uses five planned repeats and fixed provider routes.",
      "ja": "3つ目は、別の12刺激パネルを追加します。各セルで5回を計画し、プロバイダーの経路を固定しました。"
    },
    {
      "en": "Counts refer to responses or attempts, not participants. We do not pool the two text panels into a fifteen-text study.",
      "ja": "件数は応答数または試行数であり、参加者数ではありません。二つの文章パネルを15文章の研究として統合しません。"
    }
  ],
  "tied-scores": [
    {
      "en": "Now, let us look at the results. These four configurations have the same score: nine correct answers out of twelve selected EmoBench items.",
      "ja": "ここからは結果です。この4構成は、EmoBenchの選択した12項目で9問正答し、同じ得点でした。"
    },
    {
      "en": "The next two columns describe a separate experiment on three English literary texts. The benchmark items are not matched to those texts.",
      "ja": "右の2列は、3つの英語文学作品を用いた別の実験を記述しています。ベンチマーク項目とこれらの作品は対応していません。"
    },
    {
      "en": "SD tells us how much scores vary across repeated responses. A smaller SD means less variation under the recorded conditions.",
      "ja": "SDは、反復した応答間でスコアがどれだけ変動するかを示します。SDが小さいほど、記録された条件下での変動が小さいことを意味します。"
    },
    {
      "en": "The absolute shift tells us how far apart the reader-side and character-side means are. We take absolute values before averaging.",
      "ja": "絶対シフトは、読者側と登場人物側の平均値がどれだけ離れているかを示します。差の絶対値を取ってから平均します。"
    },
    {
      "en": "The brackets show conditional resampling intervals. They hold the texts and configurations fixed.",
      "ja": "角括弧内は、条件付きの再標本化区間です。文章と構成を固定しています。"
    },
    {
      "en": "So, the same task score can sit alongside different descriptor profiles. This does not show that one configuration is better.",
      "ja": "このように、同じ課題得点でも記述指標は異なり得ます。どの構成が優れているかを示すものではありません。"
    }
  ],
  "original-table": [
    {
      "en": "This table retains all six configurations and all four original descriptors, with their conditional intervals.",
      "ja": "この表は、元の6構成すべてと4指標すべてを、条件付き区間とともに示します。"
    },
    {
      "en": "All sixty responses per configuration were accepted. SD and fuzzy entropy average twenty-four emotion cells, each with ten scores.",
      "ja": "各構成の60応答はすべて受理されました。SDとファジィエントロピーは、各10スコアを持つ24感情セルを平均します。"
    },
    {
      "en": "Profile entropy averages sixty response profiles. Absolute shift averages twelve text-by-emotion contrasts.",
      "ja": "プロファイルエントロピーは60応答のプロファイルを平均します。絶対シフトは文章と感情による12の差を平均します。"
    },
    {
      "en": "The original routing outcomes are held fixed by the intervals, not adjusted away. These are not provider-independent model comparisons.",
      "ja": "区間では元の経路の観測結果を固定しており、その影響を除去してはいません。プロバイダーから独立したモデル比較ではありません。"
    }
  ],
  "target-shifts": [
    {
      "en": "The original experiment also shows different shift patterns across emotions. Each entry gives the mean absolute shift, followed by the maximum.",
      "ja": "元の実験では、評価対象による差のパターンも感情ごとに異なります。各欄は絶対シフトの平均値と、括弧内に最大値を示します。"
    },
    {
      "en": "For example, Gemini has a mean shift of thirty-six point eight three points for anger. The value for sadness is eight point five zero.",
      "ja": "例えばGeminiでは、怒りの平均シフトは36.83点、悲しみは8.50点です。"
    },
    {
      "en": "These values do not show which target is higher. We took absolute values before averaging.",
      "ja": "これらの値では、どちらの対象が高いかは分かりません。絶対値を取ってから平均しているためです。"
    },
    {
      "en": "They also mix target mode, inferred character identity, and provider routing. We cannot isolate a causal effect of the target.",
      "ja": "評価対象の設定、推定された登場人物の同一性、プロバイダー経路が混在します。評価対象の因果効果を分離することはできません。"
    }
  ],
  "selected-items": [
    {
      "en": "Acceptance checks the local output format. A benchmark may need more information before an answer can be scored.",
      "ja": "受理判定はローカルの出力形式を確認します。ベンチマークの採点には、さらに情報が必要な場合があります。"
    },
    {
      "en": "Llama has two accepted EQ-Bench answers, but neither includes all required numeric emotion values. Its EQ mean is undefined.",
      "ja": "LlamaではEQ-Benchの2応答が受理されましたが、どちらも必要な感情の数値をすべて含んでいません。EQ平均値は未定義です。"
    },
    {
      "en": "EmoBench exact match uses all twelve attempts per configuration. Rejected outputs count as non-matches.",
      "ja": "EmoBenchの完全一致率は、各構成の全12試行を分母にします。棄却された出力は不一致として数えます。"
    },
    {
      "en": "The EQ item mean uses the selected scorable items. These are implementation results on selected items, not official full-benchmark scores.",
      "ja": "EQ項目平均には、選択項目のうち採点可能なものを使います。選択項目上の実装結果であり、公式の全ベンチマーク得点ではありません。"
    }
  ],
  "extension-table": [
    {
      "en": "These are the twelve-stimulus estimates. The brackets retain the reported conditional intervals, even where an SD estimate lies above its interval.",
      "ja": "これらは12刺激の推定値です。SD推定値が区間より上にある場合も、報告された条件付き区間をそのまま示します。"
    },
    {
      "en": "GPT has one empty cell, so only ninety-two of ninety-six emotion cells contribute to its SD and fuzzy entropy.",
      "ja": "GPTには空のセルが一つあるため、SDとファジィエントロピーには96感情セル中92セルだけが寄与します。"
    },
    {
      "en": "Grok has one partial cell. All its metric units can be computed, but that does not mean there is no missingness.",
      "ja": "Grokには一部欠測したセルが一つあります。指標の全単位を計算できますが、欠測がないことを意味しません。"
    },
    {
      "en": "Profile entropy gives equal weight to accepted responses. The other two metrics give equal weight to available emotion cells.",
      "ja": "プロファイルエントロピーは受理済み応答を等重みで扱います。他の二指標は利用可能な感情セルを等重みで扱います。"
    }
  ],
  "extension-shifts": [
    {
      "en": "The signed shift preserves direction. The absolute shift measures magnitude before averaging across contrasts.",
      "ja": "符号付きシフトは方向を保ちます。絶対シフトは、差を平均する前にその大きさを取ります。"
    },
    {
      "en": "GPT has forty-four available contrasts, not forty-eight, because one target cell is empty. These contrasts use one hundred and ten responses.",
      "ja": "GPTでは一方の対象セルが空のため、利用可能な差は48ではなく44です。これらの差には110応答を使います。"
    },
    {
      "en": "A small signed mean can coexist with a much larger absolute mean. The Llama K4 example in the main talk illustrates this cancellation.",
      "ja": "符号付き平均が小さくても、絶対値の平均は大きい場合があります。本編のLlama K4の例が、この相殺を示しています。"
    },
    {
      "en": "These fixed-panel differences do not isolate target effects from other conditions. The intervals remain conditional.",
      "ja": "これらの固定パネル内の差は、対象の効果を他の条件から分離しません。区間は条件付きです。"
    }
  ],
  "different-zeros": [
    {
      "en": "These two extension results show why variation and membership ambiguity need separate descriptions.",
      "ja": "追加実験のこの二つの結果は、変動と所属の曖昧さを別々に記述する必要性を示します。"
    },
    {
      "en": "Among five hundred and seventy-two available emotion cells, seventy-two have zero SD but positive membership ambiguity.",
      "ja": "利用可能な572の感情セルのうち72セルでは、SDがゼロでも所属の曖昧さは正でした。"
    },
    {
      "en": "Forty-five cells show the reverse: zero membership ambiguity, but positive SD. These counts use the same denominator.",
      "ja": "逆に45セルでは、所属の曖昧さがゼロでもSDは正でした。分母は同じ572セルです。"
    },
    {
      "en": "These are examples found after observing this fixed panel. They illustrate different measurement objects, not independent validation.",
      "ja": "これらは固定パネルの観測後に見いだした例です。異なる測定対象を示すもので、独立した妥当性検証ではありません。"
    }
  ],
  "cancellation": [
    {
      "en": "Llama on the K4 dialogue provides an example of cancellation. Its mean SD and mean signed target shift are both zero.",
      "ja": "K4対話におけるLlamaは、相殺の例です。平均SDも平均符号付きシフトもゼロです。"
    },
    {
      "en": "Yet the mean absolute shift is five score points. The two targets are not identical across emotions.",
      "ja": "しかし、絶対シフトの平均は5点です。感情ごとに見ると、二つの対象は同一ではありません。"
    },
    {
      "en": "Positive and negative contrasts cancel when we average signed differences. Taking absolute values first keeps their magnitude visible.",
      "ja": "符号付きの差を平均すると、正と負の差が相殺します。先に絶対値を取ると、その大きさを確認できます。"
    },
    {
      "en": "This is one observed example, not a claim about future outputs. We report direction and magnitude separately.",
      "ja": "これは一つの観測例であり、将来の出力についての主張ではありません。方向と大きさを分けて報告します。"
    }
  ],
  "intervals": [
    {
      "en": "These intervals answer a narrow question. How much can a summary change when we resample the accepted responses within the observed cells?",
      "ja": "これらの区間が答えるのは限定的な問いです。観測されたセル内で受理済み応答を再標本化すると、要約値がどれだけ変わるかを表します。"
    },
    {
      "en": "Each cell fixes the configuration, the text, and the evaluation target. We resample the four emotion scores together.",
      "ja": "各セルでは、構成、文章、評価対象が固定されています。4つの感情スコアは一緒に再標本化します。"
    },
    {
      "en": "Reader-side and character-side responses are resampled separately. Repetition numbers do not form matched pairs.",
      "ja": "読者側と登場人物側の応答は別々に再標本化します。反復番号で対応のあるペアを作るわけではありません。"
    },
    {
      "en": "The texts, configurations, accepted counts, and missing cells stay fixed. The intervals do not cover uncertainty from missing responses or new texts.",
      "ja": "文章、構成、受理件数、欠測セルは固定します。欠測した応答や新しい文章による不確実性は、区間に含まれません。"
    },
    {
      "en": "With small samples, this procedure shifts SD downward. In the extension, all six configuration-level SD estimates exceed their interval upper limits.",
      "ja": "標本が小さいと、この手順ではSDが下方にずれます。追加実験では、6構成すべてのSD推定値が、それぞれの区間上限を超えています。"
    },
    {
      "en": "We keep these results as reported. We do not use the intervals to claim population coverage, statistical significance, or a model ranking.",
      "ja": "報告された結果はそのまま保持します。これらの区間から、母集団での被覆率、統計的有意性、モデルの順位を主張しません。"
    }
  ],
  "configurations": [
    {
      "en": "This table shows the fixed extension routes and the controls actually sent. A configuration includes both model and provider.",
      "ja": "この表は、追加実験で固定した経路と実際に送信した制御設定を示します。構成にはモデルとプロバイダーの両方を含みます。"
    },
    {
      "en": "GPT omitted temperature and top-p. Claude used temperature zero point four and omitted top-p. Omission does not tell us the effective default.",
      "ja": "GPTではtemperatureとtop-pを省略しました。Claudeはtemperatureを0.4とし、top-pを省略しました。省略から実効的な既定値は分かりません。"
    },
    {
      "en": "The original experiment used automatic routing. Provider composition differed by target for Gemini, DeepSeek, and Llama.",
      "ja": "元の実験は自動経路選択でした。Gemini、DeepSeek、Llamaでは、評価対象間でプロバイダーの構成が異なりました。"
    },
    {
      "en": "Neither fixed routes nor common request settings make internal computation equivalent across configurations.",
      "ja": "経路を固定しても、共通のリクエスト設定を用いても、構成間の内部計算が同等になるわけではありません。"
    }
  ],
  "limits": [
    {
      "en": "The original translation system, version, and date were not recorded. Team checking does not establish independent validation.",
      "ja": "元の翻訳のシステム、版、実行日は記録されていません。チームによる確認は独立した妥当性検証を意味しません。"
    },
    {
      "en": "For the extension, the focal persons were fixed and the KoED translations were human-approved. Source labels still are not EQ-Fuzzy reference scores.",
      "ja": "追加実験では中心人物を固定し、KoEDの翻訳は人間が承認しました。それでも元データのラベルはEQ-Fuzzyの参照スコアではありません。"
    },
    {
      "en": "Collection continuation rules changed after observed filtering and output-validation stops. Historical failures were retained, and no row was recollected.",
      "ja": "フィルターと出力検証による停止を観測した後、収集継続の規則を変更しました。過去の失敗は保持し、行の再収集はしていません。"
    },
    {
      "en": "One response's original received bytes were not saved. Also, analysis implementation details were fixed after basic results and missingness were inspected.",
      "ja": "1応答の元の受信バイトは保存されていません。また、分析実装の詳細は、基本的な結果と欠測を確認した後に固定しました。"
    },
    {
      "en": "These limits prevent claims of a wholly preregistered analysis, complete replay, or broad population generalization.",
      "ja": "これらの制約から、分析全体の事前登録、完全な再現実行、広い母集団への一般化は主張できません。"
    }
  ],
  "positioning": [
    {
      "en": "This is a qualitative comparison of measurement objects. It is not a ranking on common data.",
      "ja": "これは測定対象の定性的な比較です。共通データ上の順位ではありません。"
    },
    {
      "en": "EQ-Bench, EmoBench, and SECEU address different tasks and references. SECEU has no collected item-level results in our check.",
      "ja": "EQ-Bench、EmoBench、SECEUは異なる課題と参照を扱います。今回の評価にはSECEUの項目別収集結果はありません。"
    },
    {
      "en": "Our contribution is to report dispersion, membership ambiguity, profile evenness, acceptance, and target shifts together alongside task scores.",
      "ja": "本研究の貢献は、分散、所属の曖昧さ、プロファイルの均等さ、受理状況、対象間シフトを課題得点と併せて報告することです。"
    },
    {
      "en": "They can motivate follow-up checks. They do not replace human validation or establish a single emotional-intelligence score.",
      "ja": "これらは追加確認のきっかけになります。人間による妥当性検証を代替したり、一つの感情知能得点を確立したりするものではありません。"
    }
  ],
  "stimulus-index": [
    {
      "en": "These are the sources of the twelve stimuli in the separate extension. Select Results to see the figures for each stimulus. The stimulus texts are not reproduced in this Web edition.",
      "ja": "別の追加実験に用いた12刺激の出典です。Resultsから各刺激の結果図を開けます。このWeb版には刺激本文を転載していません。"
    },
    {
      "en": "E means EmoBank, G means GoEmotions, and K means KoED. All experimental inputs were English. The KoED inputs were human-approved English translations.",
      "ja": "EはEmoBank、GはGoEmotions、KはKoEDです。実験入力はすべて英語でした。KoEDの入力には人が確認した英訳を用いました。"
    }
  ],
  "result-index": [
    {
      "en": "The top links show all six configurations. The lower links open the result pages for each stimulus. The three experiments stay separate.",
      "ja": "上段は全6構成の集計です。下段から刺激ごとの結果を開けます。3つの実験は分けて示します。"
    },
    {
      "en": "Each stimulus has separate views of scores, variation, membership ambiguity, and target differences. The extension also has a profile-evenness view.",
      "ja": "各刺激についてスコア、変動、所属の曖昧さ、対象間の差を別々に表示します。追加実験にはプロファイルの均等さの図もあります。"
    }
  ],
  "original-variation": [
    {
      "en": "The points show SD and membership entropy for all six original configurations. The horizontal lines are the stored conditional intervals.",
      "ja": "元の実験の全6構成について、SDと所属エントロピーを点で示します。横線は保存済みの条件付き区間です。"
    }
  ],
  "original-profile-shift": [
    {
      "en": "Profile entropy describes evenness across four emotions. Absolute shift describes the size of the reader–character difference. These are different quantities.",
      "ja": "プロファイルエントロピーは4感情の均等さを表します。絶対シフトは読者と登場人物の差の大きさです。異なる量を示しています。"
    }
  ],
  "benchmark-results": [
    {
      "en": "These are selected-item scores, not official full-benchmark scores. Llama has two accepted EQ responses but no scorable EQ response, so its mean is NA.",
      "ja": "選択項目の得点であり、公式の全ベンチマーク得点ではありません。LlamaのEQ回答は2件受理されましたが採点可能な回答はなく、平均はNAです。"
    }
  ],
  "extension-variation": [
    {
      "en": "These descriptors use the separate twelve-stimulus panel. All six SD points lie above their stored interval upper limits. We show the point and interval separately.",
      "ja": "別の12刺激パネルの指標です。全6構成のSDの点推定値は保存済み区間の上限より大きくなっています。点と区間を独立に示しています。"
    }
  ],
  "extension-profile": [
    {
      "en": "This plot describes the evenness of four emotion scores within each response. The summary uses available accepted response vectors.",
      "ja": "この図は各回答内の4感情スコアの均等さを示します。集計には利用可能な受理済み回答ベクトルを使っています。"
    }
  ],
  "extension-shift": [
    {
      "en": "The signed shift shows direction: reader minus character. The absolute shift shows magnitude. Taking absolute values before averaging prevents cancellation.",
      "ja": "符号付きシフトは読者から登場人物を引いた方向を示します。絶対シフトは大きさです。平均する前に絶対値を取ることで相殺を防ぎます。"
    }
  ],
  "original-associations": [
    {
      "en": "These are exploratory rank associations across unmatched tasks and very few configurations. They do not establish validity or a useful direction for a descriptor.",
      "ja": "未対応の課題と非常に少ない構成に基づく探索的な順位相関です。指標の妥当性や望ましい大小の方向を示すものではありません。"
    }
  ],
  "original-variation-components": [
    {
      "en": "These are descriptive shares of total sum of squares in the original data. They are not causal effects or population variance components.",
      "ja": "元のデータにおける総平方和の記述的な割合です。因果効果や母集団の分散成分ではありません。"
    }
  ],
  "result-T1-scores": [
    {
      "en": "This view shows emotion scores for T1. The six configurations stay in the same order on every page.",
      "ja": "T1の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-T1-sd": [
    {
      "en": "This view shows variation across repeats for T1. The six configurations stay in the same order on every page.",
      "ja": "T1の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-T1-membership": [
    {
      "en": "This view shows membership ambiguity for T1. The six configurations stay in the same order on every page.",
      "ja": "T1の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-T1-shifts": [
    {
      "en": "This view shows reader–character differences for T1. The six configurations stay in the same order on every page.",
      "ja": "T1の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-T1-absolute": [
    {
      "en": "This view shows absolute target differences for T1. The six configurations stay in the same order on every page.",
      "ja": "T1の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-T2-scores": [
    {
      "en": "This view shows emotion scores for T2. The six configurations stay in the same order on every page.",
      "ja": "T2の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-T2-sd": [
    {
      "en": "This view shows variation across repeats for T2. The six configurations stay in the same order on every page.",
      "ja": "T2の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-T2-membership": [
    {
      "en": "This view shows membership ambiguity for T2. The six configurations stay in the same order on every page.",
      "ja": "T2の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-T2-shifts": [
    {
      "en": "This view shows reader–character differences for T2. The six configurations stay in the same order on every page.",
      "ja": "T2の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-T2-absolute": [
    {
      "en": "This view shows absolute target differences for T2. The six configurations stay in the same order on every page.",
      "ja": "T2の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-T3-scores": [
    {
      "en": "This view shows emotion scores for T3. The six configurations stay in the same order on every page.",
      "ja": "T3の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-T3-sd": [
    {
      "en": "This view shows variation across repeats for T3. The six configurations stay in the same order on every page.",
      "ja": "T3の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-T3-membership": [
    {
      "en": "This view shows membership ambiguity for T3. The six configurations stay in the same order on every page.",
      "ja": "T3の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-T3-shifts": [
    {
      "en": "This view shows reader–character differences for T3. The six configurations stay in the same order on every page.",
      "ja": "T3の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-T3-absolute": [
    {
      "en": "This view shows absolute target differences for T3. The six configurations stay in the same order on every page.",
      "ja": "T3の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-E1-scores": [
    {
      "en": "This view shows emotion scores for E1. The six configurations stay in the same order on every page.",
      "ja": "E1の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-E1-sd": [
    {
      "en": "This view shows variation across repeats for E1. The six configurations stay in the same order on every page.",
      "ja": "E1の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-E1-membership": [
    {
      "en": "This view shows membership ambiguity for E1. The six configurations stay in the same order on every page.",
      "ja": "E1の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-E1-shifts": [
    {
      "en": "This view shows reader–character differences for E1. The six configurations stay in the same order on every page.",
      "ja": "E1の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-E1-absolute": [
    {
      "en": "This view shows absolute target differences for E1. The six configurations stay in the same order on every page.",
      "ja": "E1の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-E1-profile": [
    {
      "en": "This view shows profile evenness for E1. The six configurations stay in the same order on every page.",
      "ja": "E1の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-E2-scores": [
    {
      "en": "This view shows emotion scores for E2. The six configurations stay in the same order on every page.",
      "ja": "E2の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-E2-sd": [
    {
      "en": "This view shows variation across repeats for E2. The six configurations stay in the same order on every page.",
      "ja": "E2の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-E2-membership": [
    {
      "en": "This view shows membership ambiguity for E2. The six configurations stay in the same order on every page.",
      "ja": "E2の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-E2-shifts": [
    {
      "en": "This view shows reader–character differences for E2. The six configurations stay in the same order on every page.",
      "ja": "E2の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-E2-absolute": [
    {
      "en": "This view shows absolute target differences for E2. The six configurations stay in the same order on every page.",
      "ja": "E2の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-E2-profile": [
    {
      "en": "This view shows profile evenness for E2. The six configurations stay in the same order on every page.",
      "ja": "E2の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-E3-scores": [
    {
      "en": "This view shows emotion scores for E3. The six configurations stay in the same order on every page.",
      "ja": "E3の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-E3-sd": [
    {
      "en": "This view shows variation across repeats for E3. The six configurations stay in the same order on every page.",
      "ja": "E3の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-E3-membership": [
    {
      "en": "This view shows membership ambiguity for E3. The six configurations stay in the same order on every page.",
      "ja": "E3の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-E3-shifts": [
    {
      "en": "This view shows reader–character differences for E3. The six configurations stay in the same order on every page.",
      "ja": "E3の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-E3-absolute": [
    {
      "en": "This view shows absolute target differences for E3. The six configurations stay in the same order on every page.",
      "ja": "E3の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-E3-profile": [
    {
      "en": "This view shows profile evenness for E3. The six configurations stay in the same order on every page.",
      "ja": "E3の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-E4-scores": [
    {
      "en": "This view shows emotion scores for E4. The six configurations stay in the same order on every page.",
      "ja": "E4の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-E4-sd": [
    {
      "en": "This view shows variation across repeats for E4. The six configurations stay in the same order on every page.",
      "ja": "E4の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-E4-membership": [
    {
      "en": "This view shows membership ambiguity for E4. The six configurations stay in the same order on every page.",
      "ja": "E4の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-E4-shifts": [
    {
      "en": "This view shows reader–character differences for E4. The six configurations stay in the same order on every page.",
      "ja": "E4の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-E4-absolute": [
    {
      "en": "This view shows absolute target differences for E4. The six configurations stay in the same order on every page.",
      "ja": "E4の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-E4-profile": [
    {
      "en": "This view shows profile evenness for E4. The six configurations stay in the same order on every page.",
      "ja": "E4の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-G1-scores": [
    {
      "en": "This view shows emotion scores for G1. The six configurations stay in the same order on every page.",
      "ja": "G1の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-G1-sd": [
    {
      "en": "This view shows variation across repeats for G1. The six configurations stay in the same order on every page.",
      "ja": "G1の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-G1-membership": [
    {
      "en": "This view shows membership ambiguity for G1. The six configurations stay in the same order on every page.",
      "ja": "G1の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-G1-shifts": [
    {
      "en": "This view shows reader–character differences for G1. The six configurations stay in the same order on every page.",
      "ja": "G1の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-G1-absolute": [
    {
      "en": "This view shows absolute target differences for G1. The six configurations stay in the same order on every page.",
      "ja": "G1の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-G1-profile": [
    {
      "en": "This view shows profile evenness for G1. The six configurations stay in the same order on every page.",
      "ja": "G1の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-G2-scores": [
    {
      "en": "This view shows emotion scores for G2. The six configurations stay in the same order on every page.",
      "ja": "G2の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-G2-sd": [
    {
      "en": "This view shows variation across repeats for G2. The six configurations stay in the same order on every page.",
      "ja": "G2の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-G2-membership": [
    {
      "en": "This view shows membership ambiguity for G2. The six configurations stay in the same order on every page.",
      "ja": "G2の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-G2-shifts": [
    {
      "en": "This view shows reader–character differences for G2. The six configurations stay in the same order on every page.",
      "ja": "G2の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-G2-absolute": [
    {
      "en": "This view shows absolute target differences for G2. The six configurations stay in the same order on every page.",
      "ja": "G2の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-G2-profile": [
    {
      "en": "This view shows profile evenness for G2. The six configurations stay in the same order on every page.",
      "ja": "G2の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-G3-scores": [
    {
      "en": "This view shows emotion scores for G3. The six configurations stay in the same order on every page.",
      "ja": "G3の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-G3-sd": [
    {
      "en": "This view shows variation across repeats for G3. The six configurations stay in the same order on every page.",
      "ja": "G3の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-G3-membership": [
    {
      "en": "This view shows membership ambiguity for G3. The six configurations stay in the same order on every page.",
      "ja": "G3の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-G3-shifts": [
    {
      "en": "This view shows reader–character differences for G3. The six configurations stay in the same order on every page.",
      "ja": "G3の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-G3-absolute": [
    {
      "en": "This view shows absolute target differences for G3. The six configurations stay in the same order on every page.",
      "ja": "G3の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-G3-profile": [
    {
      "en": "This view shows profile evenness for G3. The six configurations stay in the same order on every page.",
      "ja": "G3の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-G4-scores": [
    {
      "en": "This view shows emotion scores for G4. The six configurations stay in the same order on every page.",
      "ja": "G4の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-G4-sd": [
    {
      "en": "This view shows variation across repeats for G4. The six configurations stay in the same order on every page.",
      "ja": "G4の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-G4-membership": [
    {
      "en": "This view shows membership ambiguity for G4. The six configurations stay in the same order on every page.",
      "ja": "G4の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-G4-shifts": [
    {
      "en": "This view shows reader–character differences for G4. The six configurations stay in the same order on every page.",
      "ja": "G4の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-G4-absolute": [
    {
      "en": "This view shows absolute target differences for G4. The six configurations stay in the same order on every page.",
      "ja": "G4の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-G4-profile": [
    {
      "en": "This view shows profile evenness for G4. The six configurations stay in the same order on every page.",
      "ja": "G4の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-K1-scores": [
    {
      "en": "This view shows emotion scores for K1. The six configurations stay in the same order on every page.",
      "ja": "K1の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-K1-sd": [
    {
      "en": "This view shows variation across repeats for K1. The six configurations stay in the same order on every page.",
      "ja": "K1の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-K1-membership": [
    {
      "en": "This view shows membership ambiguity for K1. The six configurations stay in the same order on every page.",
      "ja": "K1の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-K1-shifts": [
    {
      "en": "This view shows reader–character differences for K1. The six configurations stay in the same order on every page.",
      "ja": "K1の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-K1-absolute": [
    {
      "en": "This view shows absolute target differences for K1. The six configurations stay in the same order on every page.",
      "ja": "K1の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-K1-profile": [
    {
      "en": "This view shows profile evenness for K1. The six configurations stay in the same order on every page.",
      "ja": "K1の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-K2-scores": [
    {
      "en": "This view shows emotion scores for K2. The six configurations stay in the same order on every page.",
      "ja": "K2の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-K2-sd": [
    {
      "en": "This view shows variation across repeats for K2. The six configurations stay in the same order on every page.",
      "ja": "K2の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-K2-membership": [
    {
      "en": "This view shows membership ambiguity for K2. The six configurations stay in the same order on every page.",
      "ja": "K2の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-K2-shifts": [
    {
      "en": "This view shows reader–character differences for K2. The six configurations stay in the same order on every page.",
      "ja": "K2の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-K2-absolute": [
    {
      "en": "This view shows absolute target differences for K2. The six configurations stay in the same order on every page.",
      "ja": "K2の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-K2-profile": [
    {
      "en": "This view shows profile evenness for K2. The six configurations stay in the same order on every page.",
      "ja": "K2の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-K3-scores": [
    {
      "en": "This view shows emotion scores for K3. The six configurations stay in the same order on every page.",
      "ja": "K3の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-K3-sd": [
    {
      "en": "This view shows variation across repeats for K3. The six configurations stay in the same order on every page.",
      "ja": "K3の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-K3-membership": [
    {
      "en": "This view shows membership ambiguity for K3. The six configurations stay in the same order on every page.",
      "ja": "K3の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-K3-shifts": [
    {
      "en": "This view shows reader–character differences for K3. The six configurations stay in the same order on every page.",
      "ja": "K3の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-K3-absolute": [
    {
      "en": "This view shows absolute target differences for K3. The six configurations stay in the same order on every page.",
      "ja": "K3の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-K3-profile": [
    {
      "en": "This view shows profile evenness for K3. The six configurations stay in the same order on every page.",
      "ja": "K3の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ],
  "result-K4-scores": [
    {
      "en": "This view shows emotion scores for K4. The six configurations stay in the same order on every page.",
      "ja": "K4の感情スコアです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Each panel is one emotion on the same zero-to-one-hundred scale. The four emotion scores do not have to add up to one hundred.",
      "ja": "各パネルは1感情で、共通の0〜100尺度を使います。4感情の合計が100になる必要はありません。"
    }
  ],
  "result-K4-sd": [
    {
      "en": "This view shows variation across repeats for K4. The six configurations stay in the same order on every page.",
      "ja": "K4の繰り返しによる変動です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "SD describes variation among the available repeated scores. A zero here describes these observed repeats, not all future responses.",
      "ja": "SDは利用可能な反復スコアの変動です。ここでゼロでも、観測した反復についての記述であり、今後の全回答を保証しません。"
    }
  ],
  "result-K4-membership": [
    {
      "en": "This view shows membership ambiguity for K4. The six configurations stay in the same order on every page.",
      "ja": "K4の所属の曖昧さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Membership entropy describes the fixed Low, Medium, and High categories. It is not model confidence or human psychological ambiguity.",
      "ja": "所属エントロピーは固定したLow・Medium・Highの区分を記述します。モデルの自信や人間の心理的な曖昧さではありません。"
    }
  ],
  "result-K4-shifts": [
    {
      "en": "This view shows reader–character differences for K4. The six configurations stay in the same order on every page.",
      "ja": "K4の読者と登場人物の差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Zero means equal target means. Distance from zero is the absolute difference for this emotion; it does not mean better or worse.",
      "ja": "ゼロは対象別平均が等しいことを示します。ゼロからの距離がその感情の絶対差であり、優劣を表すものではありません。"
    }
  ],
  "result-K4-absolute": [
    {
      "en": "This view shows absolute target differences for K4. The six configurations stay in the same order on every page.",
      "ja": "K4の対象間の絶対差です。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "This view shows the size of each target difference, with its own stored interval. It does not show which target is higher.",
      "ja": "対象間の差の大きさと、それ自体の保存済み区間です。どちらの対象が高いかは示しません。"
    }
  ],
  "result-K4-profile": [
    {
      "en": "This view shows profile evenness for K4. The six configurations stay in the same order on every page.",
      "ja": "K4の感情プロファイルの均等さです。どのページでも6構成の順序は同じです。"
    },
    {
      "en": "Higher profile entropy means a more even four-emotion profile. It is neither stronger emotion nor better performance.",
      "ja": "プロファイルエントロピーが大きいほど4感情の分布が均等です。感情の強さや性能の良さを示すものではありません。"
    }
  ]
};
