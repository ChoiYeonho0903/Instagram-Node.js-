## Instagram 구현하기 (Node.js)

# 1. 초기화면 (/)
+ static한 사이트 소개 페이지
+ 로그인을 할 수 있는 양식
+ 사용자 등록을 위한 링크

# 2. 사용자 등록 (/account)
+ 입력 양식 구성 (email, name, id, password)
+ 비밀번호 암호화

# 3. 사용자 소개 (/profile)
+ 로그인 한 ID
+ 현재 시간 표시
+ 현재 본인이 following 중인 사람의 숫자와 본인을 follow 하고 있는 사람들의 숫자를 표시

# 4. 홈 화면 (/home)
+ 상단 메뉴 아이콘으로 구성
  + home
  + New
  + Profile
  + Follow
  + Message
  + Logout
+ 검색
  + 작성자 검색
  + 일반 텍스트 검색
  + Hashtag 검색
+ 게시글
  + 3열로 사진 및 게시글 표시 (Follow 여부에 관계없이 모두 표시)
  + 작성자, 작성일, 텍스트, hashtag를 각 사진 하단에 배치
  + 게시글마다 편집 버튼 배치
+ 게시물로 부터 검색
  + 게시글 하단의 hashtag를 클릭할 경우 hashtag 검색
  + 세시글 하단의 작성자를 클릭할 경우 해당 작성자가 게시한 글들을 검색

# 5. 업로드 (/new), 편집 (/edit)
+ 한 게시물에 여러 장의 사진을 올릴 수 있는 입력 양식
+ 텍스트와 hashtag를 동시에 입력 받는 단일 텍스트 입력 양식 구성
+ 각 게시물에 편집 버튼을 누른 경우 수정, 삭제

# 6. Follow 페이지 (/follow)
+ 내가 follw 중인 사람과 follow가 가능한 사람들의 목록 표시
+ 팔로우 버튼 클릭하여 follow 상태 toggle
