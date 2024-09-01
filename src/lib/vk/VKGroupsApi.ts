import VKApi from "./VKApi";

export type GroupFilter =
	| "admin"
	| "editor"
	| "moder"
	| "advertiser"
	| "groups"
	| "publics"
	| "events"
	| "hasAddress";

export interface UserGroupsRequest {
	user_id?: number; // Идентификатор пользователя, информацию о сообществах которого требуется получить.
	filter?: GroupFilter; // Список фильтров сообществ, которые необходимо вернуть. По умолчанию возвращаются все сообщества.
	offset?: number; // Смещение для выборки подмножества сообществ.
	count?: number; // Количество сообществ, информацию о которых нужно вернуть. Максимум 1000.
}

export interface UserGroupResponse {
	response: {
		count: number;
		items: {
			id: number; // Идентификатор группы.
			description: string; // Описание группы.
			activity: string; // Вид деятельности группы.
			name: string; // Название группы.
			screen_name: string; // Короткое имя группы (доменное имя).
			is_closed: 0 | 1 | 2; // Статус группы: 0 — открытая, 1 — закрытая, 2 — частная.
			type: "group" | "page" | "event"; // Тип группы: группа, публичная страница или событие.
			is_admin: 0 | 1; // Признак, является ли текущий пользователь администратором.
			admin_level?: 1 | 2 | 3; // Уровень администратора: 1 — модератор, 2 — редактор, 3 — администратор.
			is_member: 0 | 1; // Признак, является ли текущий пользователь участником группы.
			is_advertiser: 0 | 1; // Признак, является ли текущий пользователь рекламодателем в группе.
			photo_50: string; // URL изображения группы размером 50x50 пикселей.
			photo_100: string; // URL изображения группы размером 100x100 пикселей.
			photo_200: string; // URL изображения группы размером 200x200 пикселей.
		}[];
	};
}

export default class VKGroupsApi extends VKApi {
	get(payload: UserGroupsRequest) {
		const params = new URLSearchParams();
		params.append("extended", "1");
		this.appendParams(payload, params);
		return this.getRequest<UserGroupResponse>("groups.get", params);
	}
}
