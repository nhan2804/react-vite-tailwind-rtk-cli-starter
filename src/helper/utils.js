String.prototype.isEmpty = function () {
  return this.length === 0 || !this.trim();
};

String.prototype.includeAll = function (values, sensitive = false) {
  const v = !sensitive ? this.trim().toLowerCase() : this;
  let result = true;
  values.forEach((e) => {
    e = !sensitive ? e.trim().toLowerCase() : e;
    if (!e.includes(v)) result = false;
  });

  return result;
};

String.prototype.includeMany = function (values, sensitive = false) {
  const v = !sensitive ? this.trim().toLowerCase() : this;
  let result = false;
  values.forEach((e) => {
    e = !sensitive ? e.trim().toLowerCase() : e;
    if (e.includes(v)) result = true;
  });

  return result;
};

String.prototype.searchAll = function (values, sensitive = false) {
  const v = this;
  let result = true;
  values.forEach((e) => {
    if (e.search(new RegExp(v, sensitive ? "g" : "i")) == -1) result = false;
  });

  return result;
};

String.prototype.searchMany = function (values, sensitive = false) {
  const v = this;
  let result = false;
  values.forEach((e) => {
    if (e.search(new RegExp(v, sensitive ? "g" : "i")) != -1) result = true;
  });

  return result;
};

String.prototype.normal = function () {
  var str = this.normalize("NFC");
  var from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str.toLowerCase().trim();
  //.replace(/[^a-z0-9\-]/g, '-')
  //.replace(/-+/g, '-');

  return str;
};

JSON.clone = function (json) {
  return JSON.parse(JSON.stringify(json));
};
