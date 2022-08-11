## System Design

The design of this authority system is based on the RBAC model, and the system includes three major parts: user management, role management, and authority management.

## Role

1. Super administrator: super authority, add and delete project administrators, add and delete employees, login、work

2. Project administrator: add employees, delete employees, login、work

3. Employee: some permissions, such as: login、work


# permissions

1. Add project administrator - super administrator

2. Delete project administrator - super administrator

3. Add staff - super administrator, project administrator

4. Delete employee - super administrator, project administrator

5. Login - Super Admin, Project Admin, Employee

# users

Each user has its own: id, username, password, role (can not)


# encrypt

1. Use AES encryption standard, tool: cryptr

2. Use HTTPS protocol

3. The token and the user's password are encrypted using aes. The front and back ends of the encrypted keys are consistent and updated frequently.

4. In practice this encrypted keys should be more complex, here is just an example.

# token

1. token consist with username and UTC timestamp
2. The server decrypts the token to get the username and token expiration time.
3. The token is returned to the client by setting a cookie, cookie set httponly.
4. The token is encrypted by key using aes.
5. cryptrkey keep in config.js, and the key can be more complex, and keys should be changed frequently.


# database

1. Use file reads and modifications to simulate database read and modify operations



# System functions

1. Before any operation, user need to go through login authentication to verify whether the token has expired.
2. Before performing role operations or user operations, the user's role needs to be verified. Only project administrators and system administrators can perform related operations.


## Authentication module

### Login authentication
1. verify with username and password
2. password should be encrypt by aes


```js
api: '/login'

Method: POST

params:

username: string,
password: string

example:
{
    roleName: 'hk_sales',
}

return:

example:
{
    msg: 'sucess'
}


```


### Invalidate
1. token should be encrypted by aes
2. get token from cookie
3.

api: '/login'

Method: POST

params:

token: string

example:
{
    token: '2a3260f5ac4754b8ee3021ad413ddbc11f04138d01fe0c5889a0dd7b4a97e342a4f43bb43f3c83033626a76f7ace2479705ec7579e4c151f2e2196455be09b29bfc9055f82cdc92a1fe735825af1f75cfb9c94ad765c06a8abe9668fca5c42d45a7ec233f0',
}

return:

example:
{
    msg: 'sucess'
}


### checkTokenValid
1. token must a standard aes encrypted string.
2. token should be parseable into username and timestamp.


## role module

### create role
1. must be a combination of letters and _, -, at least 3 characters long
2. if role already exsists, not allowed

```js
api: '/role/add'

Method: POST

params:

roleName: string,

example:
{
    roleName: 'hk_sales',
}

return:

example:
{
    msg: 'sucess'
}


```



### delete role
1. role must exist
2. person-related roles also need to be removed
3. before delete role, need check the role of operator

```js
api: '/role/delete'

Method: GET

params:

roleId: string

example:

{
    roleId: 'dddd',
}

return:

example:
{
    msg: 'success',
}
```


## check role
1. The token must be within the validity period
2. Parse the username from the token

```js
api: '/role/check'

Method: POST

params:

roleId: string,

example:
{
    roleId: 'r-111',
}

return:

example:
{
    msg: '',
    data: true
}


```


### add role to user
1. You cannot add duplicate roles
2. A user can have multiple roles

```js
api: '/role/addToUser'

Method: POST

params:

userId: string,
roleId: string,

example:
{
    userId: 's-8888',
    roleId: 'r-111',
}

example:
{
    msg: 'success',
}

```

### get all roles
1. token must be in valid time
2. if token expires, no other actions
3. In actual use, we first need to verify permissions


```js
api: '/role/list'

Method: GET

params:

token: string

example:

{
    token: '2a3260f5ac4754b8ee3021ad413ddbc11f04138d01fe0c5889a0dd7b4a97e342a4f43bb43f3c83033626a76f7ace2479705ec7579e4c151f2e2196455be09b29bfc9055f82cdc92a1fe735825af1f75cfb9c94ad765c06a8abe9668fca5c42d45a7ec233f0',
}

return:

example:
{
    msg: 'success',
    data: [{ "id": "r-18", "name": "PNfAar", "desc": "", "permission": [] }]
}
```


## user module

### create user
1. username: must be a combination of letters and numbers, at least 6 characters long
2. password: must contain an uppercase letter, a lowercase letter, a number, a special character, and a length of at least 8 characters

```js
api: '/user/add'

Method: POST

params:

username: string
password: string (with aes encryption)

example:
{
    username: 'zoe',
    password: '2a3260f5ac4754b8ee3021ad413ddbc11f04138d01fe0c5889a0dd7b4a97e342a4f43bb43f3c83033626a76f7ace2479705ec7579e4c151f2e2196455be09b29bfc9055f82cdc92a1fe735825af1f75cfb9c94ad765c06a8abe9668fca5c42d45a7ec233f0',
}

{
    msg: 'success',
}

```


### delete user
1. user must be exsist
2. before delete user, need check the role of operator, so need token

```js
api: '/user/delete'

Method: GET

params:

userId: string

example:
{
    userId: 'dddd',
}

return:

example:
{
    msg: 'success',
}
```


# Test case design

1. Because of time，The test cases for the two methods（checkTokenValid 、invalidate） are left unwritten here.
2. In practice, the test database should be used for testing.
3. number of use cases： 28
   - login: 5, should add 7 more， but i don't have enough time
   - role: 18
   - user: 7
   - work: 1

4. checkTokenValid test case design
   - valid token，should be 200
   - invalid token，should be 400
   - empty token， should be 403

5. invalidate
   - token is valid, and in valid time, should be true
   - token is valid, and in expires time, should be true
   - token is invalid, should be false
   - token is empty, should be false
