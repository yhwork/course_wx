import { CourseMapper, ScheduleMapper } from '../mapper/index'
import Resource from '../Resource'

const __map_course_schedule = function (model) {
    const course = CourseMapper.mapModel(model.course);
    const schedule = ScheduleMapper.mapModel(model.event);
    return { course, schedule, status: model.status };
}

class ScheduleApi {
    constructor(options) {
        const map = ScheduleMapper.mapModel;
        const config = [
            { name: 'getWithCourse', url: 'course/{ownerId}/courseevent/{eventId}', method: 'get', map: __map_course_schedule },
            { name: 'query', url: 'course/{ownerId}/course/{courseId}/events', method: 'get', map },
            { name: 'create', url: 'event/{ownerId}/event', method: 'post', map },
            { name: 'validate', url: 'event/{ownerId}/event/validate', method: 'post' },
            { name: 'reset', url: 'event/{ownerId}/event/reset', method: 'post' },
            { name: 'resetReminder', url: 'event/{ownerId}/event/resetreminder', method: 'post' },
            { name: 'delete', url: 'event/{ownerId}/event/{id}', method: 'delete' },
            { name: 'share', url: '/event/{ownerId}/event/share', method: 'post' },
            { name: 'copy', url: '/event/{ownerId}/event/copy', method: 'post' },
        ]
        this._resource = new Resource(options, config);
    }

    getWithCourse(childId, id) {
        return this._resource.getWithCourse({ params: { ownerId: childId, eventId: id } });
    }

    query(childId, courseId) {
        return this._resource.query({ params: { ownerId: childId, courseId } });
    }

    create(childId, courseId, model) {
        model.courseId = courseId;
        return this._resource.create({ params: { ownerId: childId }, data: ScheduleMapper.parseModel(model) });
    }

    validate(childId, model) {
        return this._resource.validate({ params: { ownerId: childId }, data: ScheduleMapper.parseModel(model) });
    }

    reset(childId, model) {
        const data = ScheduleMapper.parseModel(model);
        delete data.$status;
        delete data.reminderText;
        delete data.reptitionText;
        delete data.weekDaysText;
        data.startTimeSecond = null;
        data.endTimeSecond = null;
        return this._resource.reset({ params: { ownerId: childId }, data: data });
    }

    resetReminder(childId, id, reminder) {
        return this._resource.resetReminder({ params: { ownerId: childId }, data: { id, reminder } });
    }

    delete(childId, id) {
        return this._resource.delete({ params: { ownerId: childId, id } });
    }

    share(childId, id) {
        return this._resource.share({ params: { ownerId: childId }, data: { id } });
    }

    copy(childId, id) {
        return this._resource.copy({ params: { ownerId: childId }, data: { id } });
    }
}

export default ScheduleApi