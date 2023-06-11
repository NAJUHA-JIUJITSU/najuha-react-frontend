import React from 'react'
import { useState, useEffect } from 'react'
import { useTable } from 'react-table'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getAdminUserList, patchAdminUserLevel } from '../../apis/api/admin'
import './AdminUserList.css'

function AdminUserList() {
  const [userList, setUserList] = useState([])
  const [offset, setOffset] = useState(0)
  const [searchName, setSearchName] = useState('')
  const [searchLevel, setSearchLevel] = useState(2)

  const getUserList = async () => {
    const res = await getAdminUserList(offset, searchName, searchLevel)
    setUserList(oldList => [...oldList, ...res.data.result])
    setOffset(offset + 1)
  }

  const handleSearchNameChange = event => {
    setSearchName(event.target.value)
    setUserList([])
    setOffset(0)
  }

  const handleSearchLevel = event => {
    setSearchLevel(event.target.value)
    setUserList([])
    setOffset(0)
  }

  const handleLevelUp = async rowData => {
    await patchAdminUserLevel(rowData.userId, { level: 3 })
    alert(`${rowData.fullName}님의 레벨이 3으로 변경되었습니다.`)
    setUserList([])
    setOffset(0)
    getUserList()
  }

  const handleLevelDown = async rowData => {
    await patchAdminUserLevel(rowData.userId, { level: 2 })
    alert(`${rowData.fullName}님의 레벨이 2으로 변경되었습니다.`)
    setUserList([])
    setOffset(0)
    getUserList()
  }

  useEffect(() => {
    setUserList([])
    getUserList()
  }, [searchName, searchLevel])

  const data = React.useMemo(() => userList, [userList])
  const columns = React.useMemo(
    () => [
      {
        Header: 'Index',
        Cell: ({ row: { index } }) => index + 1 + offset, // 인덱스를 1로 시작하도록 설정하고, 무한 스크롤을 고려하여 offset을 더해줍니다.
      },
      {
        Header: 'UserId',
        accessor: 'userId',
      },
      {
        Header: 'Name',
        accessor: 'fullName',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phoneNumber',
      },
      {
        Header: '성별',
        accessor: 'gender',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return (
    <div className="AdminUserList-wrapper">
      <div>
        <input
          type="text"
          placeholder="이름으로 검색"
          onChange={handleSearchNameChange}
        />
        <select value={searchLevel} onChange={handleSearchLevel}>
          <option value={2}>Level 2</option>
          <option value={3}>Level 3</option>
        </select>
      </div>
      <div className="AdminUserList">
        <InfiniteScroll
          dataLength={userList.length}
          next={getUserList}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                    <div>
                      <button onClick={() => handleLevelUp(row.original)}>
                        LV Up
                      </button>
                      <button onClick={() => handleLevelDown(row.original)}>
                        LV Down
                      </button>
                    </div>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default AdminUserList
