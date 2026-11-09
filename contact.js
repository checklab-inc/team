// お問い合わせフォーム。ページ下部の CTA（#contact-form-mount）に表示し、送信は Web3Forms 経由でメールとして届く。
// 送信先メールアドレスは Web3Forms 側に登録する。このファイルにもリポジトリにも載せない。
// アクセスキー（https://web3forms.com で取得）は公開前提の値。
// 空のままなら、従来どおり「メールで問い合わせる」ボタン（mailto）のままにする。
// 入力チェックは contact-validation.js（先に読み込むこと）。このファイルは画面の組み立てと送信だけを担当する。
(function () {
  var ACCESS_KEY = "0521ffbb-74ab-433a-8b7d-7197177ebccf";
  var ENDPOINT = "https://api.web3forms.com/submit";

  var V = window.ContactValidation;
  if (!ACCESS_KEY || !V) return;

  var root = document.documentElement;
  var TRIGGER_IDS = ["mailto-header", "mailto-header-mobile"];

  // 画面に出す文言（入力エラーの文言は contact-validation.js）
  var T = {
    ja: {
      confirm: "入力内容を確認してください。",
      sending: "送信しています。",
      done: "送信しました。内容を確認して、メールでお返事します。",
      fail: "送信できませんでした。時間をおいて、もう一度お試しください。",
    },
    en: {
      confirm: "Please check your input.",
      sending: "Sending...",
      done: "Thank you. We will review your message and reply by email.",
      fail: "Failed to send. Please try again later.",
    },
  };

  function lang() {
    return root.getAttribute("data-lang") === "en" ? "en" : "ja";
  }

  function bi(ja, en) {
    return (
      '<span class="lang-ja">' +
      ja +
      '</span><span class="lang-en">' +
      en +
      "</span>"
    );
  }

  var INPUT =
    "mt-2 block w-full rounded-md border border-ink-light bg-white px-4 py-3 text-base text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft";
  var BADGE =
    '<span class="ml-2 inline-block rounded bg-amber-600 px-2 py-0.5 align-middle text-xs font-bold text-white">' +
    bi("必須", "Required") +
    "</span>";

  function field(name, ja, en, control, opts) {
    opts = opts || {};
    return (
      "<div>" +
      '<label for="cf-' +
      name +
      '" class="block text-sm font-bold">' +
      bi(ja, en) +
      (opts.required ? BADGE : "") +
      "</label>" +
      control +
      (opts.hint
        ? '<p class="mt-2 text-sm text-ink-mid">' + opts.hint + "</p>"
        : "") +
      '<p id="cf-' +
      name +
      '-error" data-error-for="' +
      name +
      '" class="mt-2 text-sm text-red-700" hidden></p>' +
      "</div>"
    );
  }

  function input(name, type, max, autocomplete) {
    return (
      '<input id="cf-' +
      name +
      '" name="' +
      name +
      '" type="' +
      type +
      '" maxlength="' +
      max +
      '"' +
      ' autocomplete="' +
      autocomplete +
      '" aria-describedby="cf-' +
      name +
      '-error" class="' +
      INPUT +
      '">'
    );
  }

  var HTML =
    '<form id="cf-form" class="mx-auto w-full max-w-2xl space-y-6 rounded-xl bg-white p-6 text-left text-ink shadow-lg md:p-10" novalidate>' +
    '<input type="hidden" name="access_key" value="' +
    ACCESS_KEY +
    '">' +
    '<input type="hidden" name="subject" value="Check Labサイトからのお問い合わせ">' +
    '<input type="hidden" name="from_name" value="Check Lab サイト">' +
    '<input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off">' +
    field(
      "company",
      "貴社名",
      "Company",
      input("company", "text", 100, "organization"),
    ) +
    field("name", "お名前", "Name", input("name", "text", 100, "name"), {
      required: true,
    }) +
    field(
      "email",
      "メールアドレス",
      "Email",
      input("email", "email", 200, "email"),
      {
        required: true,
      },
    ) +
    field("phone", "電話番号", "Phone", input("phone", "tel", 30, "tel")) +
    field(
      "message",
      "お問い合わせ内容",
      "Message",
      '<textarea id="cf-message" name="message" rows="6" maxlength="4000" aria-describedby="cf-message-error" class="' +
        INPUT +
        '"></textarea>',
      { required: true },
    ) +
    '<div class="flex flex-wrap items-center gap-x-5 gap-y-3">' +
    '<button type="submit" class="cursor-pointer rounded-md bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50">' +
    bi("送信する", "Send") +
    "</button>" +
    '<p id="cf-status" role="status" aria-live="polite" class="text-sm"></p>' +
    "</div>" +
    "</form>";

  function mount(host) {
    // 従来の mailto ボタンはフォームに置き換える
    host.className = "mt-2";
    host.innerHTML = HTML;

    var form = host.querySelector("#cf-form");
    var status = host.querySelector("#cf-status");
    var button = form.querySelector('button[type="submit"]');
    var fields = V.fields;

    function errorBox(name) {
      return form.querySelector('[data-error-for="' + name + '"]');
    }
    function control(name) {
      return form.elements.namedItem(name);
    }

    function setError(name, message) {
      var box = errorBox(name);
      box.textContent = message || "";
      box.hidden = !message;
      if (message) control(name).setAttribute("aria-invalid", "true");
      else control(name).removeAttribute("aria-invalid");
    }

    function setStatus(text, tone) {
      status.className =
        "text-sm " +
        { info: "text-ink-mid", ok: "text-accent-dark", error: "text-red-700" }[
          tone
        ];
      status.textContent = text;
    }

    fields.forEach(function (f) {
      // 入力欄を離れたときに、その欄だけ確認する（空欄は送信時に確認）。直し始めたらエラーを消す。
      control(f).addEventListener("blur", function () {
        var value = control(f).value;
        if (value) setError(f, V.validateField(f, value, lang()));
      });
      control(f).addEventListener("input", function () {
        setError(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = T[lang()];
      var data = {};
      new FormData(form).forEach(function (v, k) {
        data[k] = typeof v === "string" ? v : "";
      });
      var errors = V.validate(data, lang()).errors;
      fields.forEach(function (f) {
        setError(f, errors[f]);
      });
      var first = fields.filter(function (f) {
        return errors[f];
      })[0];
      if (first) {
        setStatus(t.confirm, "error");
        control(first).focus();
        return;
      }

      button.disabled = true;
      setStatus(t.sending, "info");
      fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          return res.json().then(function (r) {
            if (!res.ok || !r.success) throw new Error(r.message);
          });
        })
        .then(function () {
          form.reset();
          setStatus(t.done, "ok");
        })
        .catch(function () {
          setStatus(t.fail, "error");
        })
        .then(function () {
          button.disabled = false;
        });
    });
  }

  function init() {
    var host = document.getElementById("contact-form-mount");
    if (!host) return;
    mount(host);
    // ヘッダーの「お問い合わせ」は、メーラーではなくこのフォームへ移動させる
    TRIGGER_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute("href", "#contact");
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
