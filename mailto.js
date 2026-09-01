(function () {
  const to = 'kaneko@checkatoilet.com';
  const subject = 'お問い合わせ';
  const body = `Check Lab株式会社
ご担当者様

お世話になっております。
下記の通りお問い合わせいたします。

────────────────────
◆会社名・団体名：
（例：株式会社サンプル）


◆ご担当者名：
（例：山田 太郎）


◆電話番号：
（例：03-1234-5678）


◆メールアドレス：
（例：sample@example.com）


◆ご相談内容（該当するものを一つお選びください）
　例）SES／受託開発・準委任／その他


◆お問い合わせ詳細：
（ご相談の背景、ご希望の時期・条件などを具体的にご記入ください）


────────────────────

お忙しいところ恐れ入りますが、
ご確認のほどよろしくお願いいたします。
`;

  const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  ['mailto-header', 'mailto-cta'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = mailtoUrl;
  });
})();
