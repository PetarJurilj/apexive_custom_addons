/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

import { ActivityMenu } from "@hr_attendance/components/attendance_menu/attendance_menu";


patch(ActivityMenu.prototype, {
    setup() {
        super.setup();

        this.notification = useService("notification");

        // Initialize projects and tasks
        this.fetchProjects();
        this.state = useState({
            tasks: [],
        });

        // Fetch current attendance data that will be used for check out
        this.getCurrentData()
    },

    /**
     * Fetches projects from the server.
     * @returns {Array} Array of `project.project` object
     * - id {number} The ID of the project.
     * - name {string} The name of the project.
     */
    async fetchProjects() {
        const result = await this.rpc("/hr_attendance/fetch_projects");
        this.projects = result;
    },

    /**
     * Fetches tasks associated with a specific project from the server.
     * @param {number} project_id - The ID of the project for which tasks are to be fetched.
     * @returns {Array<Object>} - An array of task objects associated with the specified project.
     * Each task object has the following properties:
     * - id {number} The ID of the task.
     * - name {string} The name of the task.
     */
    async fetchTasks(project_id) {
        this.state.tasks = await this.rpc("/hr_attendance/fetch_tasks", {
            project_id: project_id,
        });
    },

    /**
     * Handles project selection change.
     * @param {Event} event - The change event object.
     */
    async onProjectChange(event) {
        const project_id = event.target.value
        this.selectedProject = project_id;
        await this.fetchTasks(project_id);
    },

    /**
     * Handles task selection change.
     * @param {Event} event - The change event object.
     */
    onTaskChange(event) {
        this.selectedTask = event.target.value;
    },

    /**
     * Handles description change.
     * @param {Event} event - The change event object.
     */
    onDescriptionChange(event) {
        this.selectedDescription = event.target.value;
    },

    /**
     * Fetches current attendance data from the server and updates UI accordingly.
     * This method ensures to have data during check out.
     */
    async getCurrentData() {
        const currentData = await this.rpc("/hr_attendance/get_current_data");

        if (currentData.project) {
            this.selectedProject = currentData.project.id;
            this.currentProject = currentData.project.name;
        }
        if (currentData.task) {
            this.selectedTask = currentData.task.id;
            this.currentTask = currentData.task.name;
        }
        if (currentData.description) {
            this.selectedDescription = currentData.description;
            this.currentDescription = currentData.description;
        }
    },

    /**
    * @override
    * Overrides the base method to add our data in sign in/out action.
    */
    async signInOut() {
        if (!this.selectedProject || !this.selectedTask || !this.selectedDescription) {
            this.notification.add(
                _t("Please fill all fields in order to Check in/Check out!"),
                { type: "danger" }
            );
            return
        }

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                async ({coords: {latitude, longitude}}) => {
                    await this.rpc("/hr_attendance/systray_check_in_out", {
                        project_id: this.selectedProject,
                        task_id: this.selectedTask,
                        description: this.selectedDescription,
                        latitude,
                        longitude,
                    })
                    await this.searchReadEmployee()
                },
                async err => {
                    await this.rpc("/hr_attendance/systray_check_in_out", {
                        project_id: this.selectedProject,
                        task_id: this.selectedTask,
                        description: this.selectedDescription,
                    })
                    await this.searchReadEmployee()
                }
            )
        }
        else{
            await this.rpc("/hr_attendance/systray_check_in_out", {
                project_id: this.selectedProject,
                task_id: this.selectedTask,
                description: this.selectedDescription,
            })
            await this.searchReadEmployee()
        }
    }
})