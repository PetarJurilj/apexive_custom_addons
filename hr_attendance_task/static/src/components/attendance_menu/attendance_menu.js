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

        // Check In
        // Initialize projects and tasks
        this.fetchProjects();
        this.state = useState({
            tasks: [],
        });

        // Check Out
        this.getCurrentData()
    },

    async fetchProjects() {
        const result = await this.rpc("/hr_attendance/fetch_projects");
        this.projects = result;
    },
    async fetchTasks() {
        this.state.tasks = await this.rpc("/hr_attendance/fetch_tasks", {
            project_id: this.selectedProject,
        });
    },

    async onProjectChange(event) {
        this.selectedProject = event.target.value;
        await this.fetchTasks();
    },
    onTaskChange(event) {
        this.selectedTask = event.target.value;
    },
    onDescriptionChange(event) {
        this.selectedDescription = event.target.value;
    },

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

    /** @override **/
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