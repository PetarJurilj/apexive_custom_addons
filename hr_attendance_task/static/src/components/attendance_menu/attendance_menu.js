/** @odoo-module **/
import { patch } from "@web/core/utils/patch";

import { ActivityMenu } from "@hr_attendance/components/attendance_menu/attendance_menu";

console.log('LOAD');

patch(ActivityMenu.prototype, {
    setup() {
        super.setup();

        this.fetchProjects();
    },

    async fetchProjects() {
        const result = await this.rpc("/hr_attendance/fetch_projects");
        this.projects = result;
        console.log('PROJECTS', this.projects);
    }
})