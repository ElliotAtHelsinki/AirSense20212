export default {
  '& .ant-tabs .ant-tabs-nav .ant-tabs-nav-wrap .ant-tabs-nav-list': {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around'
  },
  thead: {
    '& tr': {
      '& .ant-table-cell': {
        color: 'black',
        backgroundColor: '#E5E5E5',
        height: '66px',
        '&::before': {
          display: 'none'
        }
      }
    }
  }
}