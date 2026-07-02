export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function navigateTo(path, params) {
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(params).toString();
    window.location.href = `${path}?${qs}`;
  } else {
    window.location.href = path;
  }
}

export function getAllQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}
