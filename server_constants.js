constants={

  //Server data
  'hostname':'localhost',
  'port':1759,
  'db_port':27017,

  //Server behavior
  'session_timeout':10000,
  'gameRefresh':15,

  //Physical Constants
  'friction':.005,
  'collision_radius':15,
  'collision_buffer':0,
  'player_acceleration':.01,
  'player_mass':15,
  'bullet_speed':4,
  'fire_rate':1,
  'max_bullets':100,
  'bullet_mass':1,
  'bullet_base_damage':5,
  'bullet_base_dice':6,
  'bullet_base_dice_num':6,
  'player_base_health':100,

  //Gameplay Constants
  'skillPointsPerLevel':3,
}

//Autocomputed Values
constants['fire_frames']=10*constants['gameRefresh']/constants['fire_rate'];

exports.constants=constants
