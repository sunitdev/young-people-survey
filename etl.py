import pandas as pd
import numpy as np

DATA_PATH = 'dataset/responses.csv'

OUTPUT_PATH = 'dataset/visualization_dataset.csv'


def main():
    responses = pd.read_csv(DATA_PATH)

    transformed_dataset = responses.copy()

    remove_unwanted_data(transformed_dataset)

    rename_columns(transformed_dataset)

    remove_null_data(transformed_dataset)

    transform_int_to_categorical(transformed_dataset)

    visualization_data = generate_visualization_data(transformed_dataset)

    visualization_data.to_csv(OUTPUT_PATH, index=False)


def remove_unwanted_data(dataset):
    dataset.drop(['Adrenaline sports'], axis=1, inplace=True)


def rename_columns(dataset):
    dataset.rename(columns={
        'Age':                            'age',
        'Gender':                         'gender',

        # Music
        'Music':                          'music',
        'Slow songs or fast songs':       'music_slow_or_fast',
        'Dance':                          'music_disco',
        'Classical music':                'music_classical',
        'Folk':                           'music_folk',
        'Country':                        'music_country',
        'Musical':                        'music_musical',
        'Pop':                            'music_pop',
        'Rock':                           'music_rock',
        'Metal or Hardrock':              'music_metal_hard_rock',
        'Punk':                           'music_punk',
        'Hiphop, Rap':                    'music_hiphop',
        'Reggae, Ska':                    'music_reggae',
        'Swing, Jazz':                    'music_jazz',
        'Rock n roll':                    'music_rock_n_roll',
        'Alternative':                    'music_alternative',
        'Latino':                         'music_latin',
        'Techno, Trance':                 'music_techno',
        'Opera':                          'music_opera',

        # Movie
        'Movies':                         'movie',
        'Horror':                         'movie_horror',
        'Thriller':                       'movie_thriller',
        'Comedy':                         'movie_comedy',
        'Romantic':                       'movie_romantic',
        'Sci-fi':                         'movie-sci-fi',
        'War':                            'movie_war',
        'Fantasy/Fairy tales':            'movie_fantasy',
        'Animated':                       'movie_animated',
        'Documentary':                    'movie_documentary',
        'Western':                        'movie_western',
        'Action':                         'movie_action',

        # Phobias
        'Flying':                         'phobia_Flying',
        'Storm':                          'phobia_storm',
        'Darkness':                       'phobia_darkness',
        'Heights':                        'phobia_heights',
        'Spiders':                        'phobia_spiders',
        'Snakes':                         'phobia_snakes',
        'Rats':                           'phobia_rats',
        'Ageing':                         'phobia_ageing',
        'Dangerous dogs':                 'phobia_dogs',
        'Fear of public speaking':        'phobia_public_speaking',

        # Interest
        'History':                        'interest_history',
        'Psychology':                     'interest_psychology',
        'Politics':                       'interest_politics',
        'Mathematics':                    'interest_mathematics',
        'Physics':                        'interest_physics',
        'Internet':                       'interest_internet',
        'PC':                             'interest_computers',
        'Economy Management':             'interest_economy',
        'Biology':                        'interest_biology',
        'Chemistry':                      'interest_chemistry',
        'Reading':                        'interest_reading',
        'Geography':                      'interest_geography',
        'Foreign languages':              'interest_foreign_languages',
        'Medicine':                       'interest_medical',
        'Law':                            'interest_law',
        'Cars':                           'interest_cars',
        'Art exhibitions':                'interest_art',
        'Religion':                       'interest_religion',
        'Countryside, outdoors':          'interest_outdoor_activity',
        'Dancing':                        'interest_dancing',
        'Musical instruments':            'interest_musical_instrument',
        'Writing':                        'interest_writing',
        'Passive sport':                  'interest_playing_sport',
        'Active sport':                   'interest_watching_sport',
        'Gardening':                      'interest_gardening',
        'Celebrities':                    'interest_celebrity_lifestyle',
        'Shopping':                       'interest_shopping',
        'Science and technology':         'interest_science',
        'Theatre':                        'interest_theatre',
        'Fun with friends':               'interest_socializing',
        'Pets':                           'interest_pets',

        # Health
        'Smoking':                        'health_smoking',
        'Alcohol':                        'health_alcohol',
        'Healthy eating':                 'health_lifestyle',

        # Personality
        'Daily events':                   'personality_notice_daily_events',
        'Prioritising workload':          'personality_do_task_asap',
        'Writing notes':                  'personality_make_todo_list',
        'Workaholism':                    'personality_study_or_work_spare_time',
        'Thinking ahead':                 'personality_look_from_different_angles_at_task_before_going_ahead',
        'Final judgement':                'personality_bad_people_suffer_good_people_reward',
        'Reliability':                    'personality_reliable_at_work',
        'Keeping promises':               'personality_keep_promise',
        'Loss of interest':               'personality_loss_interest_quickly',
        'Friends versus money':           'personality_friends_over_money',
        'Funniness':                      'personality_be_funniest',
        'Fake':                           'personality_be_two_faced',
        'Criminal damage':                'personality_angry_damage_thing',
        'Decision making':                'personality_decision_making_take_time',
        'Elections':                      'personality_vote_in_election',
        'Self-criticism':                 'personality_regret_past_decisions',
        'Judgment calls':                 'personality_tell_if_people_listen',
        'Hypochondria':                   'personality_fear_of_sickness',
        'Empathy':                        'personality_empathy',
        'Eating to survive':              'personality_eat_to_survive',
        'Giving':                         'personality_giving_gifts',
        'Compassion to animals':          'personality_compassion_to_animals',
        'Borrowed stuff':                 'personality_look_after_borrowed_things',
        'Loneliness':                     'personality_loneliness',
        'Cheating in school':             'personality_cheating_in_school',
        'Health':                         'personality_worry_about_health',
        'Changing the past':              'personality_wish_change_the_past',
        'God':                            'personality_believe_in_god',
        'Dreams':                         'personality_have_good_dreams',
        'Charity':                        'personality_do_charity',
        'Number of friends':              'personality_lot_of_friends',
        'Punctuality':                    'personality_punctual',
        'Lying':                          'personality_lying',
        'Waiting':                        'personality_patient',
        'New environment':                'personality_adapt_new_environment',
        'Mood swings':                    'personality_mood_swings',
        'Appearence and gestures':        'personality_mannered_appearence',
        'Socializing':                    'personality_socializing',
        'Achievements':                   'personality_let_people_know_about_achievements',
        'Responding to a serious letter': 'personality_think_before_answering_important_letters',
        'Children':                       'personality_enjoy_children',
        'Assertiveness':                  'personality_given_opinion_if_felt_strongly',
        'Getting angry':                  'personality_quick_angry',
        'Knowing the right people':       'personality_connect_with_right_person',
        'Public speaking':                'personality_prepared_for_public_speaking',
        'Unpopularity':                   'personality_find_self_fault_if_people_dont_like_me',
        'Life struggles':                 'personality_cry_if_things_not_right',
        'Happiness in life':              'personality_happy_in_life',
        'Energy levels':                  'personality_level_of_energy',
        'Small - big dogs':               'personality_big_dogs_over_small',
        'Personality':                    'personality_positive_personality',
        'Finding lost valuables':         'personality_not_keep_found_items',
        'Getting up':                     'personality_difficult_to_get_up_in_morning',
        'Interests or hobbies':           'personality_have_different_hobbies',
        "Parents' advice":                'personality_listen_to_parents',
        'Questionnaires or polls':        'personality_enjoy_survey',
        'Internet usage':                 'personality_internet_time',

        # Spending Habbits
        'Finances':                       'finance_saving',
        'Shopping centres':               'spending_shopping_center',
        'Branded clothing':               'spending_branded_clothes',
        'Entertainment spending':         'spending_party_socialization',
        'Spending on looks':              'spending_looks',
        'Spending on gadgets':            'spending_gadgets',
        'Spending on healthy eating':     'spending_more_on_good_food'
    }, inplace=True)


def remove_null_data(dataset):
    dataset['gender'].replace('', np.nan, inplace=True)
    dataset.dropna(subset=['age', 'gender'], how='all', inplace=True)


def transform_int_to_categorical(dataset):
    response_to_text_mapping = {
        1.0: "Strongly disagree",
        2.0: "Disagree",
        3.0: "Neutral",
        4.0: "Agree",
        5.0: "Strongly agree"
    }

    phobia_to_text_mapping = {
        1.0: "Not afraid",
        2.0: "Slightly afraid",
        3.0: "afraid",
        4.0: "Very afraid",
        5.0: "Very much afraid"
    }

    categorical_columns = ['music', 'music_slow_or_fast', 'music_disco', 'music_classical', 'music_folk',
                           'music_country', 'music_musical', 'music_pop', 'music_rock', 'music_metal_hard_rock',
                           'music_punk', 'music_hiphop', 'music_reggae', 'music_jazz', 'music_rock_n_roll',
                           'music_alternative', 'music_latin', 'music_techno', 'music_opera',

                           'movie', 'movie_horror', 'movie_thriller', 'movie_comedy', 'movie_romantic', 'movie-sci-fi',
                           'movie_war', 'movie_fantasy', 'movie_animated', 'movie_documentary', 'movie_western',
                           'movie_action',

                           'interest_history', 'interest_psychology', 'interest_politics', 'interest_mathematics',
                           'interest_physics', 'interest_internet', 'interest_computers', 'interest_economy',
                           'interest_biology', 'interest_chemistry', 'interest_reading', 'interest_geography',
                           'interest_foreign_languages', 'interest_medical', 'interest_law', 'interest_cars',
                           'interest_art', 'interest_religion', 'interest_outdoor_activity', 'interest_dancing',
                           'interest_musical_instrument', 'interest_writing', 'interest_playing_sport',
                           'interest_watching_sport', 'interest_gardening', 'interest_celebrity_lifestyle',
                           'interest_shopping', 'interest_science', 'interest_theatre', 'interest_socializing',
                           'interest_pets',

                           'health_lifestyle',

                           'personality_notice_daily_events', 'personality_do_task_asap', 'personality_make_todo_list',
                           'personality_study_or_work_spare_time',
                           'personality_look_from_different_angles_at_task_before_going_ahead',
                           'personality_bad_people_suffer_good_people_reward', 'personality_reliable_at_work',
                           'personality_keep_promise', 'personality_loss_interest_quickly',
                           'personality_friends_over_money', 'personality_be_funniest', 'personality_be_two_faced',
                           'personality_angry_damage_thing', 'personality_decision_making_take_time',
                           'personality_vote_in_election', 'personality_regret_past_decisions',
                           'personality_tell_if_people_listen', 'personality_fear_of_sickness', 'personality_empathy',
                           'personality_eat_to_survive', 'personality_giving_gifts',
                           'personality_compassion_to_animals', 'personality_look_after_borrowed_things',
                           'personality_loneliness', 'personality_cheating_in_school', 'personality_worry_about_health',
                           'personality_wish_change_the_past', 'personality_believe_in_god',
                           'personality_have_good_dreams', 'personality_do_charity', 'personality_lot_of_friends',
                           'personality_punctual', 'personality_lying', 'personality_patient',
                           'personality_adapt_new_environment', 'personality_mood_swings',
                           'personality_mannered_appearence', 'personality_socializing',
                           'personality_let_people_know_about_achievements',
                           'personality_think_before_answering_important_letters', 'personality_enjoy_children',
                           'personality_given_opinion_if_felt_strongly', 'personality_quick_angry',
                           'personality_connect_with_right_person', 'personality_prepared_for_public_speaking',
                           'personality_find_self_fault_if_people_dont_like_me', 'personality_cry_if_things_not_right',
                           'personality_happy_in_life', 'personality_level_of_energy',
                           'personality_big_dogs_over_small', 'personality_positive_personality',
                           'personality_not_keep_found_items', 'personality_difficult_to_get_up_in_morning',
                           'personality_have_different_hobbies', 'personality_listen_to_parents',
                           'personality_enjoy_survey', 'personality_internet_time',

                           'finance_saving', 'spending_shopping_center', 'spending_branded_clothes',
                           'spending_party_socialization', 'spending_looks', 'spending_gadgets',
                           'spending_more_on_good_food']

    phobia_columns = ['phobia_Flying', 'phobia_storm', 'phobia_darkness', 'phobia_heights', 'phobia_spiders',
                      'phobia_snakes', 'phobia_rats', 'phobia_ageing', 'phobia_dogs', 'phobia_public_speaking']

    for col in categorical_columns:
        for response, text in response_to_text_mapping.items():
            dataset.loc[dataset[col] == response, col] = text

    for col in phobia_columns:
        for phobia, text in phobia_to_text_mapping.items():
            dataset.loc[dataset[col] == phobia, col] = text


def generate_visualization_data(dataset):
    visualization_dataset = pd.DataFrame(dataset, columns=['age', 'gender', 'interest_history', 'interest_mathematics',
                                                           'interest_physics', 'interest_computers', 'interest_economy',
                                                           'interest_medical', 'interest_law', 'interest_geography',
                                                           'interest_psychology', 'phobia_Flying', 'phobia_storm',
                                                           'phobia_darkness', 'phobia_heights', 'phobia_ageing',
                                                           'phobia_public_speaking'])

    return visualization_dataset


if __name__ == '__main__':
    main()
