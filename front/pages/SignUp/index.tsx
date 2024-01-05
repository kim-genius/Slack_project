import React,{useCallback,useState} from 'react';
import { Link } from 'react-router-dom';
import {Form,Label,Input,LinkContainer,Button,Header,Error,Success} from './styles';
import useinput from '@hooks/useInput';
import axios from 'axios';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
  const navigate = useNavigate()
  const {data,error,mutate} =  useSWR('/api/users',fetcher)
  const [email, onChangeEmail,setEmail] = useinput(''); 
  const [nickname, onChangeNickname,setNickname] = useinput('');
  const [password,setPassword] = useState('');
  const [passwordCheck,setPasswordCheck] = useState('');
  const [mismatchError,setMismatchError] = useState(false)
  const [signUpError,setSignUpError] = useState('')
  const [signUpSuccess,setSignUpSuccess] = useState(false)
   // const onChangeEmail = useCallback((e)=>{
  //   setEmail(e.target.value)
  // },[])

  // const onChangeNickname = useCallback(
  //   (e) => {
  //     setNickname(e.target.value);
  //   },
  //   [],
  // );

  const onChangePassword = useCallback(
    (e:any) => {
      setPassword(e.target.value); 
      setMismatchError(e.target.value !== passwordCheck)
    },
    [passwordCheck]
  );

  const onChangePasswordCheck = useCallback(
    (e:any) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password)
    },
    [password],
  );
  const onSubmit = useCallback ((e:any)=>{
    e.preventDefault()
    
    if(!mismatchError && nickname){
      console.log('서버로 회원가입하기')
      setSignUpError('')
      setSignUpSuccess(false)
      axios.post('/api/users',{
        email,
        nickname,
        password
      })
      .then((res)=>{console.log(res),setSignUpSuccess(true)})
      .catch((err)=>{console.log(err.response),setSignUpError(err.response.data)})
    }
  },[email,password,nickname,passwordCheck,mismatchError])


  if(data){
    navigate('/workspace/sleact/channel/일반')

  }
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit = {onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname}  onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password}onChange={onChangePassword}  />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
              
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;