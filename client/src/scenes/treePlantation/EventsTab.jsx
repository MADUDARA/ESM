import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Buttons from 'components/Button';
import EventCreateModal from './EventCreateModal';
import EventUpdateModal from './EventUpdateModal';
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTreeEventsQuery, useDeleteTreeEventMutation, useUpdateTreeEventMutation } from "state/api";

const EventsTab = () => {
  const theme = useTheme();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { data, isLoading, refetch, error } = useGetTreeEventsQuery();
  const [deleteTreeEvent] = useDeleteTreeEventMutation();
  const [updateTreeEvent] = useUpdateTreeEventMutation();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (error) {
      console.error("Error fetching events:", error);
      if (error.status === 400 && error.data.error === "Event ID already exists") {
        alert("Event ID already exists");
        refetch();
      }
    }
  }, [error]);

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleOpenUpdateModal = (event) => {
    setSelectedEvent(event);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (updatedEvent) => {
    updateTreeEvent(updatedEvent)
      .unwrap()
      .then((response) => {
        console.log("Event updated successfully");
        refetch();
      })
      .catch((error) => {
        console.error("Error updating event:", error);
        if (error.status === 400 && error.data.error === "Event ID already exists") {
          alert("Event ID already exists");
        }
      });
  };

  const handleDelete = (eventID) => {
    deleteTreeEvent(eventID)
      .unwrap()
      .then((response) => {
        console.log("Event deleted successfully");
        refetch();
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
        if (error.status === 400 && error.data.error === "Event ID already exists") {
          alert("Event ID already exists");
        }
      });
  };

  const eventColumns = [
    // {
    //   field: "coverImage",
    //   headerName: "Cover Image",
    //   flex: 0.2,
    //   renderCell: (params) => (
    //     <Avatar src={params.row.coverImage ? `${params.row.coverImage}` : ''} />
    //   ),
    //   sortable: false,
    //   filterable: false,
    // },
    {
      field: "eventID",
      headerName: "Event ID",
      flex: 1,
    },
    {
      field: "eventName",
      headerName: "Event Name",
      flex: 1,
    },
    {
      field: "eventDate",
      headerName: "Event Date",
      flex: 0.5,
    },
    {
      field: "province",
      headerName: "Province",
      flex: 0.5,
    },
    {
      field: "district",
      headerName: "District",
      flex: 0.5,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "comments",
      headerName: "Comments",
      flex: 1.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.3,
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
              onClick={() => handleOpenUpdateModal(params.row)}
            >
              Update
            </Button>
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Buttons label="Create Event" onClick={handleOpenCreateModal} />
        <EventCreateModal openModal={openCreateModal} closeModal={handleCloseCreateModal} />
        <EventUpdateModal
          openModal={openUpdateModal}
          closeModal={handleCloseUpdateModal}
          eventDetails={selectedEvent}
          updateEvent={handleUpdateEvent}
        />
      </Box>
      <Box
        mt="40px"
        height="75vh"
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
          rows={data || []}
          columns={eventColumns}
          rowCount={(data && data.length) || 0}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          sortingMode="server"
          onSortModelChange={(newSortModel) => setSort(newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: {
              searchInput,
              setSearchInput,
              search,
              setSearch,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default EventsTab;
