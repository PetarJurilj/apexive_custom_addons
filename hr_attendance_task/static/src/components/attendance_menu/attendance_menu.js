/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { useState } from "@odoo/owl";

import { ActivityMenu } from "@hr_attendance/components/attendance_menu/attendance_menu";


patch(ActivityMenu.prototype, {
    setup() {
        super.setup();

        // Initialize projects and tasks
        this.fetchProjects();
        this.state = useState({
            tasks: [],
        });
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
    }
})