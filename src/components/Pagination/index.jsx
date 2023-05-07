import React, { memo } from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

const Pagination = ({
  currentPage,
  pageCount,
  initialPage,
  onPageChange,
  className,
  list,
}) => {
  console.log(currentPage);
  return (
    <div className={className}>
      <ReactPaginate
        pageCount={pageCount}
        initialPage={initialPage - 1}
        previousLabel={"Trước"}
        previousLinkClassName={"previous button-secondary fw-bold"}
        nextLabel={"Sau"}
        nextLinkClassName={"next button-secondary fw-bold"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={({ selected }) => {
          onPageChange(selected + 1);
          if (list?.current)
            list.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        forcePage={currentPage - 1}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
        // pageClassName={"button-secondary--outline fw-bold"}
        pageLinkClassName={"button-secondary--outline fw-bold"}
      />
    </div>
  );
};

export default styled(memo(Pagination))`
  .pagination {
    display: flex;
    justify-content: center;
    padding: 16px;
    margin-top: 16px;
    column-gap: 8px;
    > li {
      > a {
        padding: 10px 20px;
      }
      &.active {
        a {
          background-color: ${(props) => props.theme.colorSecondary};
          color: #fafafa;
        }
      }
    }
  }
  .disabled {
    visibility: hidden;
  }
`;
