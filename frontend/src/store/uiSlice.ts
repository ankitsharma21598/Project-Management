import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  createProject: boolean;
  editProject: string | null;
  createTask: string | null;
  editTask: string | null;
  taskDetail: string | null;
}

interface UiState {
  sidebarOpen: boolean;
  modals: ModalState;
  activeFilter: string;
  searchQuery: string;
}

const initialState: UiState = {
  sidebarOpen: true,
  modals: {
    createProject: false,
    editProject: null,
    createTask: null,
    editTask: null,
    taskDetail: null,
  },
  activeFilter: "all",
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openCreateProjectModal: (state) => {
      state.modals.createProject = true;
    },
    closeCreateProjectModal: (state) => {
      state.modals.createProject = false;
    },
    openEditProjectModal: (state, action: PayloadAction<string>) => {
      state.modals.editProject = action.payload;
    },
    closeEditProjectModal: (state) => {
      state.modals.editProject = null;
    },
    openCreateTaskModal: (state, action: PayloadAction<string>) => {
      state.modals.createTask = action.payload;
    },
    closeCreateTaskModal: (state) => {
      state.modals.createTask = null;
    },
    openEditTaskModal: (state, action: PayloadAction<string>) => {
      state.modals.editTask = action.payload;
    },
    closeEditTaskModal: (state) => {
      state.modals.editTask = null;
    },
    openTaskDetailModal: (state, action: PayloadAction<string>) => {
      state.modals.taskDetail = action.payload;
    },
    closeTaskDetailModal: (state) => {
      state.modals.taskDetail = null;
    },
    setActiveFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openCreateProjectModal,
  closeCreateProjectModal,
  openEditProjectModal,
  closeEditProjectModal,
  openCreateTaskModal,
  closeCreateTaskModal,
  openEditTaskModal,
  closeEditTaskModal,
  openTaskDetailModal,
  closeTaskDetailModal,
  setActiveFilter,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer;
