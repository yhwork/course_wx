import regeneratorRuntime from '../../../lib/runtime'
import { CourseMapper, LessonMapper } from '../mapper/index'
import Resource from '../Resource'

const __map_course_lesson = function (model) {
    const course = CourseMapper.mapModel(model.course);
    const lesson = LessonMapper.mapModel(model.timetable);
    return { course, lesson };
}

class LessonApi {
    constructor(options) {
        const map = LessonMapper.mapModel;
        const mapHistory = LessonMapper.mapHistoryModel;
        const config = [
            { name: 'get', url: 'timetable/{ownerId}/coursetimetable/{id}', method: 'get', map: __map_course_lesson },
            { name: 'query', url: 'timetable/{ownerId}/timetables', method: 'get', map },
            { name: 'queryByDate', url: 'timetable/{ownerId}/timetables?startDate={beginDate}&endDate={endDate}', method: 'get', map },
            { name: 'queryByCourse', url: 'course/{ownerId}/coursetimetable/{courseId}', method: 'get', map },
            { name: 'queryByCourseAndEvent', url: 'course/{ownerId}/coursetimetable/list?courseId={courseId}&eventId={eventId}', method: 'get', map },
            { name: 'absent', url: 'timetable/{ownerId}/timetable/absent', method: 'post' },
            { name: 'adjust', url: 'timetable/{ownerId}/timetable/adjust', method: 'post' },
            { name: 'makeup', url: 'timetable/{ownerId}/timetable/makeup', method: 'post' },
            { name: 'delete', url: 'timetable/{ownerId}/timetable', method: 'delete' },
            { name: 'history', url: 'timetable/{ownerId}/timetable/history/{id}', method: 'get', map: mapHistory },
        ]
        this._resource = new Resource(options, config);
        this._api = options.api;
    }

    getWithCourse(childId, id) {
        return this._resource.get({ params: { ownerId: childId, id } });
    }

    query(childId) {
        return this._resource.query({ params: { ownerId: childId } });
    }

    queryByDate(childId, beginDate, endDate) {
        return this._resource.queryByDate({ params: { ownerId: childId, beginDate, endDate } });
    }

    queryByCourse(childId, courseId) {
        return this._resource.queryByCourse({ params: { ownerId: childId, courseId } });
    }

    queryByCourseAndEvent(childId, courseId, eventId) {
        return this._resource.queryByCourseAndEvent({ params: { ownerId: childId, courseId, eventId } });
    }

    absent(childId, id, absence) {
        return this._resource.absent({ params: { ownerId: childId }, data: { id, absent: Number(absence) } });
    }

    async adjust(childId, model) {
        model = await this._attachId(childId, model);
        return await this._resource.adjust({ params: { ownerId: childId }, data: LessonMapper.parseAdjustModel(model) });
    }

    async makeup(childId, model) {
        model = await this._attachId(childId, model);
        return this._resource.makeup({ params: { ownerId: childId }, data: LessonMapper.parseMakeupModel(model) });
    }

    async _attachId(childId, model) {
        const { courseId, eventId } = model;
        if (typeof courseId !== 'undefined' && typeof eventId !== 'undefined') {
            return model;
        }
        const { lesson } = await this.getWithCourse(childId, model.id);
        return Object.assign({}, { courseId: lesson.courseId, eventId: lesson.eventId }, model);
    }

    delete(childId, id) {
        return this._resource.delete({ params: { ownerId: childId }, data: { id } });
    }

    history(childId, id) {
        return this._resource.history({ params: { ownerId: childId, id } });
    }
}

export default LessonApi