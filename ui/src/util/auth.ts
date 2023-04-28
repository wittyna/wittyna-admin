export function logout() {
  location.href = `/admin/logout?redirect_uri=${encodeURIComponent(
    location.href
  )}`;
}
