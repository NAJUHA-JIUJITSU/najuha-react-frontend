export const handleError = error => {
  switch (error.status) {
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
//404 없는 페이지 => navigate to 404 page
//409 이미 존재하는 대회 신청했을때, 업데이트할떄, => alert message
//500 서버 에러 => navigate to 500 page
