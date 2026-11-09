// お問い合わせフォームの入力チェック。画面（DOM）には触れず、値とエラー文言だけを扱う。
// 画面側は contact.js。このファイルを先に読み込むこと（window.ContactValidation を公開する）。
// サーバ側の検証は Web3Forms 任せなので、ここは入力ミスを早く知らせるためのもの。
(function () {
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_PATTERN = /^\+?[0-9\-() ]+$/;

  // 項目の定義。label は「〇〇を入力してください」の〇〇に使う。
  var RULES = {
    company: { label: { ja: '貴社名', en: 'Company' }, required: false, max: 100 },
    name: { label: { ja: 'お名前', en: 'Name' }, required: true, max: 100 },
    email: { label: { ja: 'メールアドレス', en: 'Email' }, required: true, max: 200 },
    phone: { label: { ja: '電話番号', en: 'Phone' }, required: false, max: 30 },
    message: { label: { ja: 'お問い合わせ内容', en: 'Message' }, required: true, min: 10, max: 4000 }
  };

  var MESSAGES = {
    ja: {
      required: function (r) { return r.label.ja + 'を入力してください。'; },
      max: function (r) { return r.label.ja + 'は' + r.max + '文字以内で入力してください。'; },
      min: function (r) { return r.label.ja + 'は' + r.min + '文字以上で入力してください。'; },
      email: 'メールアドレスの形式で入力してください。（例: name@example.com）',
      phone: '電話番号は数字とハイフンで入力してください。（例: 03-1234-5678）'
    },
    en: {
      required: function (r) { return r.label.en + ' is required.'; },
      max: function (r) { return r.label.en + ' must be ' + r.max + ' characters or fewer.'; },
      min: function (r) { return r.label.en + ' must be at least ' + r.min + ' characters.'; },
      email: 'Please enter a valid email address. (e.g. name@example.com)',
      phone: 'Please enter digits and hyphens only. (e.g. 03-1234-5678)'
    }
  };

  var FIELDS = Object.keys(RULES);

  function digitsOf(value) { return value.replace(/\D/g, ''); }

  // 1項目を調べて、エラー文言（問題なければ undefined）を返す。
  function validateField(name, value, lang) {
    var rule = RULES[name];
    if (!rule) return undefined;
    var m = MESSAGES[lang === 'en' ? 'en' : 'ja'];
    var v = String(value == null ? '' : value).trim();

    if (!v) return rule.required ? m.required(rule) : undefined;
    if (rule.max && v.length > rule.max) return m.max(rule);
    if (rule.min && v.length < rule.min) return m.min(rule);

    if (name === 'email' && !EMAIL_PATTERN.test(v)) return m.email;
    if (name === 'phone') {
      // 全角の数字・ハイフンは半角にそろえてから調べる
      var p = v.normalize('NFKC');
      var digits = digitsOf(p).length;
      if (!PHONE_PATTERN.test(p) || digits < 9 || digits > 15) return m.phone;
    }
    return undefined;
  }

  // 全項目を調べる。{ ok: boolean, errors: { 項目名: エラー文言 } }
  function validate(data, lang) {
    var errors = {};
    FIELDS.forEach(function (f) {
      var message = validateField(f, data[f], lang);
      if (message) errors[f] = message;
    });
    return { ok: Object.keys(errors).length === 0, errors: errors };
  }

  window.ContactValidation = {
    fields: FIELDS,
    validateField: validateField,
    validate: validate
  };
})();
