(function () {
  const to = 'kaneko@checkatoilet.com';
  const subject = 'お問い合わせ';
  const body = `Check Lab株式会社
ご担当者様

初めてご連絡いたします。
下記の通りお問い合わせいたします。

────────────────────
◆会社名・団体名：


◆ご担当者名：


◆電話番号：


◆メールアドレス：


◆ご相談内容（該当するものをご記入ください）
　例）SES / 受託開発・準委任 / その他


◆お問い合わせ詳細：



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
