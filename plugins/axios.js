export default function ({ $axios, app }) {
  $axios.onError((error) => {
    const statusCode = error.response.status

    // refresh token if it expired
    if (statusCode === 403) {
      const originalRequest = error.config
      if (!originalRequest._retry) {
        originalRequest._retry = true
        return $axios
          .post('auth/refresh', {
            refresh: app.$auth.getRefreshToken('refresh'),
          })
          .then((response) => {
            originalRequest.headers.Authorization =
              'Bearer ' + response.data.accessToken
            app.$auth.setToken('local', 'Bearer ' + response.data.accessToken)
            return $axios(originalRequest)
          })
      }
    }

    return Promise.reject(error)
  })
}
