export const handleError = error => {
  if (error.code === 'ERR_NETWORK') {
    window.location.href = '/500'
  }
  switch (error.response.status) {
    case 400:
      alert(`${error.message}`)
      break
    case 401:
      alert('접근 권한이 없습니다.')
      break
    case 403:
      alert(`${error.message}`)
      break
    case 404:
      window.location.href = '/404'
      break
    case 409:
      alert(`${error.message}`)
      break
    case 500:
      window.location.href = '/500'
      break
    default:
      // do something
      break
  }
}

//400 잘못된 요청 => alert message
//401 로그인 안됨 => alert 접근권한이 없습니다.
//403 (대회 활성할떄 만쓰이는 듯) alert띄우기 => alert message
//404 없는 페이지 => navigate to 404 page => 요청하신 url에 대한 페이지를 찾을 수 없습니다.
//409 이미 존재하는 대회 신청했을때, 업데이트할떄, => alert message
//500 서버 에러 => navigate to 500 page => 불편을 드려 죄송합니다. 서버 에러가 발생하여 서비스 이용이 불가능합니다. 고객센터로 문의주시나 잠시 후 다시 시도해 주세요.
