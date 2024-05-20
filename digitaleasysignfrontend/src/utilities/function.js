const link = (path) => process.env.REACT_APP_MAIN_SITE + path;

function env(name) {
  const nodeENV = process.env.NODE_ENV.toUpperCase();
  return (
    process.env[`REACT_APP_${nodeENV}_${name}`] ||
    process.env[`REACT_APP_${name}`]
  );
}

function getFolderName(key) {
  const startIndex = key.search(/\/[a-zA-Z0-9-_ ]+\/$/gi);
  return key.slice(startIndex + 1, -1);
}

function getFileName(key) {
  const startIndex = key.lastIndexOf("/");
  return key.slice(startIndex + 1);
}

function encodeKey(key) {
  if (!typeof key === "string") return;
  const index = key.indexOf("files/");
  return encodeURIComponent(key.slice(index + 6));
}

const handleAxiosError = (e, showError) => {
  console.log(e);
  const errors = e?.response?.data?.errors;
  const status = e?.response?.status;

  if (status === 500) return showError("Something went wrong");

  if (status === 400)
    return showError(errors || `Ensure you've entered valid information.`);

  if (status === 404)
    return showError(errors || `We can't find what you are looking for.`);

  if (e?.response?.data) {
    if (typeof errors === "object" && errors !== null)
      showError(Object.values(errors));
    showError(
      errors || "Our server encountered an error, Please try again later"
    );
  } else {
    showError("Something went wrong");
  }
};

function dirname(filePath) {
  if (typeof filePath !== "string") {
    throw new TypeError("Path must be a string");
  }

  const separator = "/";
  const lastIndex = filePath.lastIndexOf(separator);
  if (lastIndex === -1) {
    return ".";
  }

  return filePath.slice(0, lastIndex);
}

function basename(filePath, ext = "") {
  if (typeof filePath !== "string") {
    throw new TypeError("Path must be a string");
  }

  const separator = "/";
  const lastIndex = filePath.lastIndexOf(separator);
  let baseName = filePath.slice(lastIndex + 1);

  if (ext && baseName.endsWith(ext)) {
    baseName = baseName.slice(0, -ext.length);
  }

  return baseName;
}

function parseKB(KB) {
  const sizes = ["KB", "MB", "GB", "TB"];
  if (KB === 0) return "0 KB";
  const i = Math.floor(Math.log2(KB) / 10);
  return `${parseFloat((KB / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

function getFullURL(location) {
  return env("DOMAIN") + location.pathname + location.search;
}

export {
  link,
  env,
  encodeKey,
  getFileName,
  getFolderName,
  handleAxiosError,
  dirname,
  basename,
  parseKB,
  getFullURL,
};
