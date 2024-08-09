import React, { useState, useEffect } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetItemsInQuery } from "state/itemsApi";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import Items_in from "./addItemsIn";
import UpdateFormCI from "./updateFormCI";

const IncomingDonations = () => {
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [showUpdateFormCI, setShowUpdateFormCI] = useState(false);
  const [selectedItems, setSelectedItems] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [setSort] = useState({});
  const [setSearch] = useState("");
  const { data, isLoading, refetch } = useGetItemsInQuery();
  const [rowIndex, setRowIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (data) {
      setRowIndex(0); // Reset the index when data changes
    }
  }, [data]);

  const handleDelete = (itemID) => {
    // Add your delete logic here
  };

  const handleUpdateClick = (item) => {
    setSelectedItems(item); // Set the selected item data
    setShowUpdateFormCI(true); // Show the update form
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setShowUpdateFormCI(false);
  };

  const generateRowsWithIndex = (rows) => {
    return rows.map((row, index) => ({ ...row, index: rowIndex + index + 1 }));
  };

  const incommingDonations = [
    {
      field: "itemName",
      headerName: "Item Name",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.5,
      sortable: false,
    },
    {
      field: "donorId",
      headerName: "Donor",
      flex: 0.5,
      sortable: false,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around">
          <Box
            display="flex"
            justifyContent="flex-end"
            mr={2}
            sx={{
              "& button": {
                backgroundColor: theme.palette.secondary[400],
                color: "white",
              },
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </Button>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{
              "& button": {
                backgroundColor: theme.palette.primary[700],
                color: "white",
              },
            }}
          >
            <Button
              variant="contained"
              color="info"
              onClick={() => handleUpdateClick(params.row)}
            >
              Update
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        mb={2}
        sx={{
          "& button": {
            backgroundColor: theme.palette.secondary[400],
            color: "white",
          },
        }}
      >
        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={() => setShowForm(true)}
        >
          Add Item
        </Button>
      </Box>

      <UpdateFormCI
        open={showUpdateFormCI}
        handleClose={handleCloseForm}
        refetch={refetch}
        itemToUpdate={selectedItems}
      />

      <Items_in
        open={showForm}
        handleClose={handleCloseForm}
        refetch={refetch}
      />

      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={generateRowsWithIndex(data || [])}
          columns={incommingDonations}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
      </Box>
    </Box>
  );
};

export default IncomingDonations;
