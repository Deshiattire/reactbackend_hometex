import React from 'react'

const NoDataFound = () => {
  return (
    <tr>
      <td colSpan="100">
        <div className={'no-data-found text-center mt-3 w-100'}>
        <p className={"text-danger"}>
            No Data Found
        </p>
    </div>
      </td>
    </tr>
  );
};

export default NoDataFound;
